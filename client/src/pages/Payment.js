import React, { useState, useEffect } from 'react';
import Divider from '@material-ui/core/Divider';
import Link from '@material-ui/core/Link';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { useStoreContext } from '../utils/GlobalState';
import { CLEAR } from '../utils/actions';
import Loader from '../components/Loader';
import API from '../utils/API';
import Tara from '../utils/images/tara.jpg';

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh',
  },
  image: {
    backgroundImage:`url(${Tara})`,
    backgroundRepeat: 'no-repeat', 
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  info: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    height: '100%',
  },
  title: {
    fontSize: 64,
    [theme.breakpoints.down('sm')]: {
      fontSize: 36,
    },
  },
  subtitle: {
    fontWeight: 'bold',
  },
  divider: {
    marginBottom: theme.spacing(1),
  },
  leftDivider: {
    [theme.breakpoints.up('lg')]: {
      borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
    },
  },
  topDivider: {
    borderTop: '1px solid rgba(0, 0, 0, 0.12)',
    marginTop: theme.spacing(1),
    paddingTop: theme.spacing(1),
  },
  marginTop: {
    marginTop: theme.spacing(2),
  },
  total: {
    fontWeight: 'bold',
  },
}));

export default function Payment() {
  const classes = useStyles();
  const [state, dispatch] = useStoreContext();
  const [session, setSession] = useState({});

  const params = new URLSearchParams(window.location.search);
  const sessionId = params.get('session_id');
  const success = params.get('success');

  useEffect(() => {
    // Deal with payment details.
    async function fetchSession() {
      const session = await API.getSession(sessionId);
      const customer = await API.getCustomer(session.data.customer);
      const lineItems = session.data.line_items.filter(item => (item.description !== 'USPS' && item.description !== 'Taxes'));
      const shippingCost = session.data.line_items.find(item => item.description === 'USPS');
      const taxesCost = session.data.line_items.find(item => item.description === 'Taxes');

      // Deal with EasyPost. Should throw error if shipment has already been
      // purchased from EasyPost.
      try {
        const shipmentId = session.data.meta_data.shipment_id;
        const rateId = session.data.meta_data.rate_id;
        const purchase = await API.buyShipment(shipmentId, { rate_id: rateId });

        // If payment was successful, clear the cart and update database.
        if (success) {
          for await (const item of state.cart) {
            const { data } = await API.getPrint(item.id);

            await API.updatePrint(item.id, {
              quantity: data.quantity - item.quantity
            }, { new: true });
          }
          
          dispatch({ type: CLEAR });
          localStorage.removeItem('bfg-cart');
        }

        // Add purchase to database. Will only occur if shipment has not yet
        // been purchased.
        API.createPurchase({ 
          session_id: session.data.id,
          purchase_id: purchase.data.id,
          status: 'purchased'
        }).then(({ data }) => {
          API.updateUser(state.user._id, 
            { $push: { purchases: data._id }}, 
            { new: false });
        });

      } catch(err) { console.log('ERROR: ', err); }

      setSession({
        session: session.data,
        pi_id: session.data.pi_id,
        payment_method: session.data.payment_method,
        subtotal: session.data.subtotal,
        line_items: lineItems,
        shipping: customer.data.shipping,
        shippingCost: shippingCost.amount_subtotal,
        taxesCost: taxesCost.amount_subtotal
      });
    }
    if (state.isLoggedIn) { fetchSession(); }
  }, [dispatch, sessionId, state.cart, state.user._id, state.isLoggedIn, success]);

  return(
    <>
      <Grid container className={classes.root}>
        <CssBaseline />
        <Grid item xs={false} sm={2} className={classes.image} />
        <Grid item xs={12} sm={10}>
          <Grid container component='main'>
            <Grid item xs={12} md={10} className={classes.info}>
              <Typography component='h1' variant='h2' className={classes.title} gutterBottom>
                Blue Fig Editions
              </Typography>
              {(Object.entries(session).length === 0)
                ?
                  <Loader loading={Object.entries(session).length === 0} />
                :
                  <>
                    {success === 'true'
                      ?
                        <>
                          <Typography variant='h6'>
                            Thanks for your purchase!
                          </Typography>
                          <Typography variant='body1' style={{ marginBottom: 32 }}>
                            A confirmation email has been sent to {session.payment_method.billing_details.email}.
                          </Typography>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                              <Typography variant='subtitle1' className={classes.subtitle}>
                                Billing Address
                              </Typography>
                              <Divider className={classes.divider} light/>
                              <Typography variant='body2'>
                                {session.payment_method.billing_details.name}
                              </Typography>
                              <Typography variant='body2'>
                                {session.payment_method.billing_details.address.line1}
                              </Typography>
                              <Typography variant='body2'>
                                {session.payment_method.billing_details.address.line2}
                              </Typography>
                              <Typography variant='body2'>
                                {session.payment_method.billing_details.address.city}, {session.payment_method.billing_details.address.state} {session.payment_method.billing_details.address.postal_code}
                              </Typography>
                              <Typography varaint='body2'>
                                {session.payment_method.billing_details.address.country}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography variant='subtitle1' className={classes.subtitle}>
                                Payment Method
                              </Typography>
                              <Divider className={classes.divider} light/>
                              <Typography variant='body2'>
                                {session.payment_method.card.brand}
                              </Typography>
                              <Typography variant='body2'>
                                **** **** **** {session.payment_method.card.last4}
                              </Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography variant='subtitle1' className={classes.subtitle}>
                                Order Details
                              </Typography>
                              <Divider className={classes.divider} light />
                              <Grid container spacing={1}>
                                <Grid item xs={12} lg={4}>
                                  <Typography variant='subtitle2' className={classes.subtitle}>
                                    Order Number
                                  </Typography>
                                  <Typography variant='body2' style={{ marginBottom: 24}}>
                                    {session.pi_id}
                                  </Typography>
                                  <Typography variant='subtitle2' className={classes.subtitle}>
                                    Shipping Address
                                  </Typography>
                                  <Typography variant='body2'>
                                    {session.shipping.name}
                                  </Typography>
                                  <Typography variant='body2'>
                                    {session.shipping.address.line1}
                                  </Typography>
                                  <Typography variant='body2'>
                                    {session.shipping.address.line2}
                                  </Typography>
                                  <Typography variant='body2'>
                                    {`${session.shipping.address.city}, ${session.shipping.address.state} ${session.shipping.address.postal_code}`}
                                  </Typography>
                                  <Typography varaint='body2' style={{ marginBottom: 24}}>
                                    {session.shipping.address.country}
                                  </Typography>
                                </Grid>
                                <Grid item xs={12} lg={8} className={classes.leftDivider}>
                                  <Grid container>
                                    <Grid item xs={6}>
                                      <Typography variant='subtitle2' className={classes.subtitle}>
                                        Items
                                      </Typography>
                                      {session.line_items.map((item, index) => {
                                        return(
                                          <Typography key={index} variant='body2'>
                                            {item.description}
                                          </Typography>
                                        );
                                      })}
                                    </Grid>
                                    <Grid item xs={3}>
                                      <Typography variant='subtitle2' className={classes.subtitle} align='right'>
                                        Quantity
                                      </Typography>
                                      {session.line_items.map((item, index) => {
                                        return(
                                          <Typography key={index} variant='body2' align='right'>
                                            {item.quantity}
                                          </Typography>
                                        );
                                      })}
                                    </Grid>
                                    <Grid item xs={3}>
                                      <Typography variant='subtitle2' className={classes.subtitle} align='right'>
                                        Cost
                                      </Typography>
                                      {session.line_items.map((item, index) => {
                                        return(
                                          <Typography key={index} variant='body2' align='right'>
                                            ${(item.amount_subtotal / 100).toFixed(2)}
                                          </Typography>
                                        );
                                      })}
                                    </Grid>
                                    <Grid item xs={6} />
                                    <Grid item xs={3}>
                                      <Typography variant='body2' align='right' className={classes.marginTop}>
                                        Subtotal
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={3}>
                                      <Typography variant='body2' align='right' className={classes.marginTop}>
                                        ${((session.subtotal - session.shippingCost - session.taxesCost) / 100).toFixed(2)}
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={6} />
                                    <Grid item xs={3}>
                                      <Typography variant='body2' align='right'>
                                        Shipping
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={3}>
                                      <Typography variant='body2' align='right'>
                                        ${(session.shippingCost / 100).toFixed(2)}
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={6} />
                                    <Grid item xs={3}>
                                      <Typography variant='body2' align='right'>
                                        Taxes
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={3}>
                                      <Typography variant='body2' align='right'>
                                        ${(session.taxesCost / 100).toFixed(2)}
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={6} />
                                    <Grid item xs={3} className={classes.topDivider}>
                                      <Typography variant='body2' align='right' className={classes.total}>
                                        Total
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={3} className={classes.topDivider}>
                                      <Typography variant='body2' align='right' className={classes.total}>
                                        ${(session.subtotal / 100).toFixed(2)}
                                      </Typography>
                                    </Grid>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography variant='body2' paragraph>
                                If you have any questions, please contact me at <Link href='mailto:tkennedy118@gmail.com' color='secondary'>martino@bluefig.com</Link> Please 
                                be sure to include the Order Number in the subject line of your email.
                              </Typography>
                              <Link href='/home' variant='body1' color='textSecondary'>
                                Return to main site
                              </Link>
                            </Grid>
                          </Grid>
                        </>
                      :
                        <>
                          <Typography variant='h6'>
                            Purchase was unsuccessful!
                          </Typography>
                          <Typography variant='body2' paragraph>
                            Please contact me at <Link href='mailto:tkennedy118@gmail.com' color='secondary'>martino@bluefig.com</Link> for questions regarding this purchase.
                          </Typography>
                          <Link href='/home' variant='body1' color='primary'>
                            Return to main site
                          </Link>
                        </>
                    }
                  </>
              }
            </Grid>
            <Divider orientation='vertical' flexItem />
            <Grid item xs={false} md={2} />
          </Grid>
        </Grid>
      </Grid>
      <Loader loading={state.loading} />
    </>
  );
}
