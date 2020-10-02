import React, { useState, useEffect } from 'react';
import Image from 'material-ui-image';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import Hidden from '@material-ui/core/Hidden';
import Divider from '@material-ui/core/Divider';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Hero from '../components/Hero';
import ShippingForm from '../components/ShippingForm';
import SignInModal from '../components/SignInModal';
import StripeCheckoutBtn from '../components/StripeCheckoutBtn';
import { useStoreContext } from '../utils/GlobalState';
import { LOADING, REMOVE_ITEM } from '../utils/actions';
import API from '../utils/API';

const getSteps = () => {
  return ['View Cart', 'Shipping', 'Review'];
};

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh',
  },
  cart: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2, 1),
  },
  top: {
    marginBottom: theme.spacing(2),
  },
  print: {
    padding: theme.spacing(2),
  },
  cartItem: {
    maxHeight: 128,
  },
  image: {
    marginLeft: 'auto',
    marginRight: 'auto',
    maxWidth: 96,
    maxHeight: 96,
  },
  info: {
    paddingTop: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    [theme.breakpoints.only('xs')]: {
      paddingLeft: theme.spacing(1),
    },
  },
  title: {
    [theme.breakpoints.only('xs')]: {
      fontSize: 16,
    },
  },
  checkbox: {
    alignSelf: 'center',
  },
  totalSection: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(0),
  },
  total: {
    fontSize: '1.15rem',
    fontWeight: 'bold',
    marginTop: theme.spacing(.5),
  },
  aligntRight: {
  },
  button: {
    marginTop: theme.spacing(1),
    minWidth: 224,
  },
  emptyCart: {
    fontSize: 16,
  },
  emptyCartWrapper: {
    textAlign: 'center',
    margin: theme.spacing(3, 0),
  },
  selectLink: {
    borderRight: '0.05em solid gray',
    paddingBottom: 2,
    paddingRight: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  stepper: {
    marginBottom: theme.spacing(1),
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  buttonsBottom: {
    marginTop: theme.spacing(4),
  },
}));

function Cart() {
  const classes = useStyles();
  const [state, dispatch] = useStoreContext();
  const [cart, setCart] = useState([]);

  // Toggles for selecting cart items, and for displaying modal.
  const [checked, setChecked] = useState({});
  const [toggle, setToggle] = useState(false);
  const [modal, setModal] = useState(false);

  // Deals with steps.
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();

  // Deals with theming.
  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.only('xs'));

  // Calculations
  const [costs, setCosts] = useState({
    subtotal: 0,
    taxes: 0,
    shipping: 0,
  });

  // Stepper ==================================================================
  const handleNext = () => {
    if (state.isLoggedIn) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else {
      setModal(true);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  // ==========================================================================

  const getCart = () => {
    // Update local storage after delete.
    localStorage.setItem('bfg-cart', JSON.stringify([...state.cart]));

    dispatch({ type: LOADING });
    API.getPrints()
      .then(results => {
        const cart = results.data.filter(print => {
          const item = state.cart.find(item => item.id === print._id);
          if (item) return true;
        });
        let checked = {};
        let subtotal = 0;
        
        // Set initial checks and subtotal
        cart.forEach(item => {
          const cartObj = state.cart.find(obj => obj.id === item._id);
          checked[item._id] = false;
          subtotal += item.price * cartObj.quantity;
        });

        setCart(cart);
        setChecked(checked);
        setCosts({ ...costs, subtotal });
      })
      .catch(err => console.log(err));  
    dispatch({ type: LOADING });
  };

  const handleChange = (event) => {
    setChecked({ ...checked, [event.target.name]: event.target.checked });
  };

  const handleToggle = () => {
    const temp = {};
    for (const _id in checked) {
      temp[_id] = !toggle;
    }

    setToggle(!toggle);
    setChecked(temp);
  };

  const handleDelete = () => {
    const temp = state.cart.filter(item => checked[item.id] === true);

    temp.forEach(item => {
      dispatch({
        type: REMOVE_ITEM,
        item: { id: item.id, quantity: item.quantity }
      });
    });
  };

  const getPrice = (print) => {
    const cartObj = state.cart.find(obj => obj.id === print._id);
    if (cartObj) {
      return `$${(print.price * cartObj.quantity).toFixed(2)}`;
    } else {
      return 0;
    }
  };

  const getQuantity = (print) => {
    const cartObj = state.cart.find(obj => obj.id === print._id);
    if (cartObj) {
      return cartObj.quantity;
    } else {
      return 0;
    }
  };

  useEffect(() => {
    getCart();
  }, [state.cart.length]);

  return (
    <div className={classes.root}>
      <Hero default={true}>
        <div className={classes.cart}>
          <Container maxWidth='sm' justify='center' style={{ padding: 4 }}>
            <Paper className={classes.paper} elevation={0} square>
              <Typography align='center' component='h2' variant='h4' color='textPrimary'>
                Checkout
              </Typography>
              <Stepper activeStep={activeStep} alternativeLabel className={classes.stepper}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              {activeStep === 0
                ?
                  <>
                    <Grid container>
                      <Grid item xs={12}>
                        <Grid container className={classes.top}>
                          <Grid item xs={12} sm={8}>
                            <Link component='button' color='textSecondary' variant='body1' className={classes.selectLink} onClick={handleToggle}>
                              {toggle ? 'Unselect All' : 'Select All'}
                            </Link>
                            <Link component='a' href='/sale' color='textSecondary' variant='body1'>
                              Keep Shopping
                            </Link>
                          </Grid>
                          <Hidden xsDown>
                            <Grid item xs={12} sm={4}>
                              <Typography variant='subtitle2' color='textSecondary' align='right'>
                                Price
                              </Typography>
                            </Grid>
                          </Hidden>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Divider />
                    {cart.length > 0
                      ?
                        <>
                          {cart.map((print, index) => (
                            <div key={index}>
                              <Grid container className={classes.cartItem}>
                                <Grid item xs={2} align='center' className={classes.checkbox}>
                                  <Checkbox
                                    checked={checked[print._id] || false}
                                    color='primary'
                                    inputProps={{ 'aria-label': 'select item'}}
                                    name={print._id}
                                    onChange={handleChange}
                                  />
                                </Grid>
                                <Grid item xs={4} sm={2}>
                                  <Image src={print.image} className={classes.image} style={{ padding: 48 }} />
                                </Grid>
                                <Grid item xs={6} sm={8} className={classes.info}>
                                  <Grid container>
                                    <Grid item xs={12} sm={6}>
                                      <Typography variant='body1' color='textPrimary' className={classes.title} align={xs ? 'right' : 'left'}>
                                        {print.name}
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                      <Grid container>
                                        <Grid item xs={12}>
                                          <Typography variant='body1' color='textPrimary' align='right'>
                                            Qty: {getQuantity(print)}
                                          </Typography>
                                          <Typography variant='body1' color='textPrimary' align='right' style={{ fontWeight: 'bold' }}>
                                            {getPrice(print)}
                                          </Typography>
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </Grid>
                              </Grid>
                              <Divider />
                            </div>
                          ))}
                        </>
                      :
                        <div className={classes.emptyCartWrapper}>
                          <Typography variant='overline' className={classes.emptyCart}>
                            Uh oh! Your cart is empty.
                          </Typography>
                        </div>
                    }
                    <Grid container className={classes.totalSection}>
                      <Grid item xs={12} sm={6}>
                        <Link component='button' variant='body1' color='textSecondary' onClick={handleDelete}>
                          Remove Selected
                        </Link>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant='h6' align='right'>
                          Subtotal
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant='body1' align='right'>
                          {costs.subtotal === 0 ? '$0.00' : `$${costs.subtotal.toFixed(2)}`}
                        </Typography>
                      </Grid>
                    </Grid>
                  </>
                :
                  <></>
              }
              {activeStep === 1
                ?
                  <>
                    <ShippingForm setCosts={setCosts} costs={costs} />
                  </>
                :
                  <></>
              }
              {activeStep == 2
                ?
                  <>
                    <Grid container className={classes.top}>
                      <Hidden xsDown>
                        <Grid item xs={12}>
                          <Typography variant='subtitle2' color='textSecondary' align='right'>
                            Price
                          </Typography>
                        </Grid>
                      </Hidden>
                    </Grid>
                    <Divider />
                    {cart.length > 0
                      ?
                        <>
                          {cart.map((print) => (
                            <div key={print._id}>
                              <Grid container className={classes.cartItem}>
                                <Grid item xs={6} sm={2}>
                                  <Image src={print.image} className={classes.image} style={{ padding: 48 }} />
                                </Grid>
                                <Grid item xs={6} sm={10} className={classes.info}>
                                  <Grid container>
                                    <Grid item xs={12} sm={6}>
                                      <Typography variant='body1' color='textPrimary' className={classes.title} align={xs ? 'right' : 'left'}>
                                        {print.name}
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                      <Grid container>
                                        <Grid item xs={12}>
                                          <Typography variant='body1' color='textPrimary' align='right'>
                                            Qty: {getQuantity(print)}
                                          </Typography>
                                          <Typography variant='body1' color='textPrimary' align='right' style={{ fontWeight: 'bold' }}>
                                            {getPrice(print)}
                                          </Typography>
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </Grid>
                              </Grid>
                              <Divider />
                            </div>
                          ))}
                        </>
                      :
                        <div className={classes.emptyCartWrapper}>
                          <Typography variant='overline' className={classes.emptyCart}>
                            Uh oh! Your cart is empty.
                          </Typography>
                        </div>
                    }
                    <Grid container spacing={0} className={classes.totalSection}>
                      <Grid item xs={0} sm={6}/>
                      <Grid item xs={6} sm={3}>
                        <Typography variant='body1' align={xs ? 'left' : 'right'}>
                          Subtotal
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Typography variant='body1' align='right'>
                          ${costs.subtotal.toFixed(2)}
                        </Typography>
                      </Grid>
                      <Grid item xs={0} sm={6}/>
                      <Grid item xs={6} sm={3}>
                        <Typography variant='body1' align={xs ? 'left' : 'right'}>
                          Shipping
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Typography variant='body1' align='right'>
                          ${costs.shipping.toFixed(2)}
                        </Typography>
                      </Grid>
                      <Grid item xs={0} sm={6}/>
                      <Grid item xs={6} sm={3}>
                        <Typography variant='body1' align={xs ? 'left' : 'right'}>
                          Taxes
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Typography variant='body1' align='right'>
                          ${costs.taxes.toFixed(2)}
                        </Typography>
                      </Grid>
                      <Grid item xs={0} sm={6}/>
                      <Grid item xs={6} sm={3}className={classes.topDivider}>
                        <Typography variant='body1' align={xs ? 'left' : 'right'} className={classes.total}>
                          Total
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sm={3}className={classes.topDivider}>
                        <Typography variant='body1' align='right' className={classes.total}>
                          ${(costs.subtotal + costs.shipping + costs.taxes).toFixed(2)}
                        </Typography>
                      </Grid>
                    </Grid>
                  </>
                :
                  <></>
              }
              <Grid container className={classes.buttonsBottom}>
                <Grid item xs={12} align='center'>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    className={classes.backButton}
                    disableElevation
                  >
                    Back
                  </Button>
                  {activeStep === 2
                    ?
                      <StripeCheckoutBtn />
                    :
                      <Button 
                        variant='contained'
                        color='primary'
                        onClick={handleNext}
                        disabled={(activeStep === 0 && state.cart.length === 0) || (activeStep === 1 && costs.shipping === 0)}
                        disableElevation
                      >
                        Next
                      </Button>
                  }
                </Grid>
              </Grid>
            </Paper>
          </Container>
        </div>
      </Hero>
      <SignInModal modal={modal} setModal={setModal} />
    </div>
  );
}

export default Cart;
