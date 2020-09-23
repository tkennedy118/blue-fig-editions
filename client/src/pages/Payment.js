import React, { useState, useEffect } from 'react';
import Divider from '@material-ui/core/Divider';
import Link from '@material-ui/core/Link';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { useStoreContext } from '../utils/GlobalState';
import { LOADING, CLEAR } from '../utils/actions';
import API from '../utils/API';
import Tara from '../utils/images/tara.jpg';

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '95vh',
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
    height: '100vh',
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
  const params = new URLSearchParams(window.location.search);
  const sessionId = params.get('session_id');
  const success = params.get('success');
  console.log('SUCCESS: ', success);

  const [state, dispatch] = useStoreContext();
  const [payment, setPayment] = useState(false);
  const [items, setItems] = useState({});

  useEffect(() => {

    // Deal with payment details.
    dispatch({ type: LOADING });
    async function fetchSession() {
      const session = await API.getSession(sessionId);
      const intent = await API.getPaymentIntent(session.data.payment_intent);
      const method = await API.getPaymentMethod(intent.data.payment_method);

      setPayment({
        session: session.data,
        intent: intent.data,
        method: method.data
      });
    }
    fetchSession();

    // Deal with cart details.
    async function fetchItems() {
      const { data } = await API.getPrints();
      const items = data.filter(print => state.cart.includes(print._id));

      setItems(items);
    }
    fetchItems();
    dispatch({ type: LOADING });

    // Clear cart if payment was a success.
    if (success) {
      dispatch({ type: CLEAR });
      localStorage.removeItem('bfg-cart');
    }

  }, [sessionId]);

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
              {(success === 'true' && payment)
                ?
                  <>
                    <Typography variant='h6'>
                      Thanks for your purchase!
                    </Typography>
                    <Typography variant='body1' style={{ marginBottom: 32 }}>
                      A confirmation email has been sent to {payment.method.billing_details.email}.
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant='subtitle1' className={classes.subtitle}>
                          Billing Address
                        </Typography>
                        <Divider className={classes.divider} light/>
                        <Typography variant='body2'>
                          {payment.method.billing_details.name}
                        </Typography>
                        <Typography variant='body2'>
                          {payment.method.billing_details.address.line1}
                        </Typography>
                        <Typography variant='body2'>
                          {payment.method.billing_details.address.line2}
                        </Typography>
                        <Typography variant='body2'>
                          {payment.method.billing_details.address.city}, {payment.method.billing_details.address.state} {payment.method.billing_details.address.postal_code}
                        </Typography>
                        <Typography varaint='body2'>
                          {payment.method.billing_details.address.country}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant='subtitle1' className={classes.subtitle}>
                          Payment Method
                        </Typography>
                        <Divider className={classes.divider} light/>
                        <Typography variant='body2'>
                          {payment.method.card.brand}
                        </Typography>
                        <Typography variant='body2'>
                          **** **** **** {payment.method.card.last4}
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
                              {payment.intent.id}
                            </Typography>
                            <Typography variant='subtitle2' className={classes.subtitle}>
                              Shipping Address
                            </Typography>
                            <Typography variant='body2'>
                              {payment.intent.shipping.name}
                            </Typography>
                            <Typography variant='body2'>
                              {payment.intent.shipping.address.line1}
                            </Typography>
                            <Typography variant='body2'>
                              {payment.intent.shipping.address.line2}
                            </Typography>
                            <Typography variant='body2'>
                              {payment.intent.shipping.address.city}, {payment.intent.shipping.address.state} {payment.intent.shipping.address.postal_code}
                            </Typography>
                            <Typography varaint='body2' style={{ marginBottom: 24}}>
                              {payment.intent.shipping.address.country}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} lg={8} className={classes.leftDivider}>
                            <Grid container>
                              <Grid item xs={6}>
                                <Typography variant='subtitle2' className={classes.subtitle}>
                                  Items
                                </Typography>
                                {items.length > 0
                                  ?
                                    items.map((item, index) => {
                                      return(
                                        <Typography key={index} variant='body2'>
                                          {item.name}
                                        </Typography>
                                      );
                                    })
                                  :
                                    <Typography variant='body2'>
                                      No items to display.
                                    </Typography>
                                }
                              </Grid>
                              <Grid item xs={3}>
                                <Typography variant='subtitle2' className={classes.subtitle} align='right'>
                                  Quantity
                                </Typography>
                                {items.length > 0
                                  ?
                                    <Typography varaint='body2' align='right'>
                                      1
                                    </Typography>
                                  :
                                    <></>
                                }
                              </Grid>
                              <Grid item xs={3}>
                                <Typography variant='subtitle2' className={classes.subtitle} align='right'>
                                  Cost
                                </Typography>
                                {items.length > 0
                                  ?
                                    items.map((item, index) => {
                                      return(
                                        <Typography key={index} variant='body2' align='right'>
                                          ${item.price.toFixed(2)}
                                        </Typography>
                                      );
                                    })
                                  :
                                    <></>
                                }
                              </Grid>
                              <Grid item xs={6} />
                              <Grid item xs={3}>
                                <Typography variant='body2' align='right' className={classes.marginTop}>
                                  Subtotal
                                </Typography>
                              </Grid>
                              <Grid item xs={3}>
                                <Typography variant='body2' align='right' className={classes.marginTop}>
                                  ${(payment.session.amount_subtotal / 100).toFixed(2)}
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
                                  ${(payment.session.total_details.amount_tax / 100).toFixed(2)}
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
                                  $0.00
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
                                  ${(payment.session.amount_total / 100).toFixed(2)}
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
                        <Link href='/home' variant='body1' color='primary'>
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
            </Grid>
            <Divider orientation='vertical' flexItem />
            <Grid item xs={false} md={2} />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
