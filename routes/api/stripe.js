const router = require('express').Router();
const Stripe = require('stripe');
const db = require('../../models');

// For asynchronous looping.
async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

// Strip configuration.
router.route('/config')
  .get(async (req, res) => {
    res.send({
      publicKey: process.env.STRIPE_PUBLIC_KEY,
    });
  });

// Fetch the Checkout session to display the JSON result on the success page.
router.route('/checkout-sessions/:id')
  .get(async(req, res) => {
    const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
    const result = await stripe.checkout.sessions.retrieve(req.params.id,
      {
        expand: ['payment_intent.payment_method', 'line_items']
      });

    res.send(result);
  });

// Fetch the Payment Intent after a session is completed.
router.route('/payment-intents/:id')
  .get(async(req, res) => {
    const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
    const result = await stripe.paymentIntents.retrieve(req.params.id);

    res.send(result);
  });

// Fetch the Payment Method after a payment is completed.
router.route('/payment-methods/:id')
  .get(async(req, res) => {
    const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
    const result = await stripe.paymentMethods.retrieve(req.params.id);

    res.send(result);
  });

// Create checkout session.
router.route('/create-checkout-session')
  .post(async (req, res) => {
    const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
    const domainURL = process.env.DOMAIN;
    const { user, cart, locale } = req.body;
    let customer = null;
    let items = [];

    // Create new stripe customer or retrieve existing customer.
    // User is linked to stripe account.
    if (user.stripe_id !== null) {
      try {
        customer = await stripe.customers.retrieve(user.stripe_id);
      } catch (err) { console.log(err); }

    } else {  // User is not linked to stripe account.

      try {
        customer = await stripe.customers.create({
          email: user.email || null
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
    await asyncForEach(cart, async(_id) => {

      try {
        const data = await db.Print.findById(_id);
        items.push({
          price_data: {
            currency: 'usd',
            unit_amount: data.price * 100,
            product_data: {
              name: data.name,
              images: [data.image],
              description: data.description
            },
          },
          quantity: 1
        });

      } catch(err) {
        console.log('ERROR: ', err);
      }
    });

    // Create new Checkout Session for the order
    // For full details see https://stripe.com/docs/api/checkout/sessions/create
    const session = await stripe.checkout.sessions.create({
      payment_method_types: process.env.PAYMENT_METHODS.split(', '),
      mode: 'payment',
      locale: locale,
      billing_address_collection: 'required',
      shipping_address_collection: { allowed_countries: ['US'] },
      customer: customer.id || null,
      line_items: items,
      success_url: `${domainURL}/payment?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${domainURL}/payment?success=false&session_id={CHECKOUT_SESSION_ID}`
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
