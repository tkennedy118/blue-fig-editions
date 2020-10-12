const router = require('express').Router();
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const EasyPost = require('@easypost/api');
const easypost = new EasyPost(process.env.EASYPOST_API_KEY);
const db = require('../../models');
const isAuthenticated = require('../../config/middleware/isAuthenticated');

// For asynchronous looping.
async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

// Strip configuration.
router.route('/config')
  .get(isAuthenticated, async (req, res) => {
    res.send({
      publicKey: process.env.STRIPE_PUBLIC_KEY,
    });
  });

// Fetch the Checkout session to display the JSON result on the success page.
router.route('/checkout-sessions/:id')
  .get(isAuthenticated, async(req, res) => {
    const result = await stripe.checkout.sessions.retrieve(req.params.id,
      {
        expand: ['payment_intent.payment_method', 'line_items']
      });

    res.send({
      id: result.id,
      line_items: result.line_items.data,
      meta_data: result.metadata,
      subtotal: result.amount_subtotal,
      pi_id: result.payment_intent.id,
      customer: result.customer,
      payment_method: result.payment_intent.payment_method
    });
  });

// Fetch the Payment Intent after a session is completed.
router.route('/payment-intents/:id')
  .get(isAuthenticated, async(req, res) => {
    const result = await stripe.paymentIntents.retrieve(req.params.id);

    res.send(result);
  });

router.route('/customer/:id')
  .get(isAuthenticated, async(req, res) => {
    const result = await stripe.customers.retrieve(req.params.id);

    res.send(result);
  });

// Fetch the Payment Method after a payment is completed.
router.route('/payment-methods/:id')
  .get(isAuthenticated, async(req, res) => {
    const result = await stripe.paymentMethods.retrieve(req.params.id);
    res.send(result);
  });

// Create customer.
router.route('/create-customer')
  .post(isAuthenticated, async(req, res) => {
    const { email } = req.body;

    try {
      customer = await stripe.customers.create({ email: email || null });
      res.send(customer);

    } catch (err) { 
      res.status(422).send(err); 
    }
  });

// Create checkout session.
router.route('/create-checkout-session')
  .post(isAuthenticated, async (req, res) => {
    const domainURL = process.env.DOMAIN;
    const { user, cart, shipping, address, locale } = req.body;
    let customer = null;
    let rate = {};
    let items = [];
    let taxes = 0;

    // Create address object that fits stripes docs.
    const shippingAddress = {
      name: address.name,
      address: {
        line1: address.street1,
        line2: address.street2,
        city: address.city,
        state: address.state,
        postal_code: address.zip,
        country: address.country
      }
    };

    // Create new stripe customer or retrieve existing customer.
    // User is linked to stripe account.
    if (user.stripe_id !== null) {
      try {
        customer = await stripe.customers.update(
          user.stripe_id, 
          { shipping: shippingAddress }
        );
      } catch (err) { console.log(err); }

    } else {  // User is not linked to stripe account.

      try {
        customer = await stripe.customers.create({
          email: user.email || null,
          shipping: shippingAddress
        });
      } catch (err) { console.log(err); }

      // If user is signed in, link stripe account.
      if (user._id !== null) {
        try {
          await db.User.update({ _id: user._id }, {
            stripe_id: customer.id
          })
        } catch(err) { console.log(err) }
      }
    }

    // Convert cart to valid items for stripe checkout.
    await asyncForEach(cart, async(item) => {
      try {
        const data = await db.Print.findById({ _id: item.id });
        items.push({
          price_data: {
            currency: 'usd',
            unit_amount: data.price * 100,
            product_data: {
              name: data.name,
              images: [data.image],
              description: data.description
            }
          },
          quantity: item.quantity
        });

      } catch(err) {
        console.log(err);
      }
    });

    // Get shipping rate from easypost
    await easypost.Shipment.retrieve(shipping.shipment_id)
      .then((response) => {
        rate = response.rates.find(rate => rate.id === shipping.rate_id);

        if (rate) {
          items.push({
            price_data: {
              currency: 'usd',
              unit_amount: parseFloat(rate.rate) * 100,
              product_data: {
                name: rate.carrier,
                description: rate.service
              }
            },
            quantity: 1
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });

    // Add taxes as a line item. Includes shipping cost.
    let subtotal = 0;
    items.forEach(item => {
      subtotal += item.price_data.unit_amount * item.quantity;
    });
    taxes = (parseFloat(subtotal) * (process.env.TAX_RATE / 100)).toFixed(0);

    items.push({
      price_data: {
        currency: 'usd',
        unit_amount: taxes,
        product_data: {
          name: 'Taxes',
          description: 'TN Sales Tax'
        }
      },
      quantity: 1
    });

    // Create new Checkout Session for the order
    // For full details see https://stripe.com/docs/api/checkout/sessions/create
    const session = await stripe.checkout.sessions.create({
      payment_method_types: process.env.PAYMENT_METHODS.split(', '),
      mode: 'payment',
      locale: locale,
      billing_address_collection: 'required',
      customer: customer.id || null,
      line_items: items,
      success_url: `${domainURL}/payment?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${domainURL}/payment?success=false&session_id={CHECKOUT_SESSION_ID}`,
      metadata: {
        shipment_id: shipping.shipment_id,
        rate_id: shipping.rate_id
      }
    });

    res.send({
      sessionId: session.id,
    });
  });

// Webhook handler for asynchronous events.
router.route('/webhook')
  .post(async (req, res) => {
    let eventType;
    
    // Check if webhook signing is configured.
    if (process.env.STRIPE_WEBHOOK_SECRET) {
      // Retrieve the event by verifying the signature using the raw body and secret.
      let event;
      let signature = req.headers['stripe-signature'];

      try {
        event = stripe.webhooks.constructEvent(
          req.rawBody,
          signature,
          process.env.STRIPE_WEBHOOK_SECRET
        );
      } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`);
        return res.sendStatus(400);
      }
      // Extract the object from the event.
      data = event.data;
      eventType = event.type;
    } else {
      // Webhook signing is recommended, but if the secret is not configured in `config.js`,
      // retrieve the event data directly from the request body.
      data = req.body.data;
      eventType = req.body.type;
    }

    if (eventType === 'checkout.session.completed') {
      console.log(`🔔  Payment received!`);
    }

    res.sendStatus(200);
  });

module.exports = router;
