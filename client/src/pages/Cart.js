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
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Hero from '../components/Hero';
import StripeCheckoutBtn from '../components/StripeCheckoutBtn';
import { useStoreContext } from '../utils/GlobalState';
import { LOADING, REMOVE_ITEM } from '../utils/actions';
import API from '../utils/API';

const localTheme = createMuiTheme({
  palette: {
    secondary: {
      light: '#e57373',
      main: '#f44336',
      dark: '#d32f3f',
    },
  },
});

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
    maxHeight: 256,
  },
  image: {
    marginLeft: 'auto',
    marginRight: 'auto',
    maxWidth: 256,
    maxHeight: 256,
    paddingTop: theme.spacing(1),
  },
  info: {
    paddingTop: theme.spacing(3),
    paddingLeft: theme.spacing(2),
    [theme.breakpoints.only('xs')]: {
      paddingTop: theme.spacing(2),
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
    padding: theme.spacing(1),
  },
  total: {
    fontSize: '1.15rem',
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
}));

function Cart() {
  const classes = useStyles();
  const [state, dispatch] = useStoreContext();
  const [cart, setCart] = useState([]);
  const [checked, setChecked] = useState({});
  const [toggle, setToggle] = useState(false);
  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.only('xs'));

  // Calculations
  const [costs, setCosts] = useState({
    subtotal: 0,
    taxes: 0,
    shipping: 0,
    total: 0
  });

  const getCart = () => {
    dispatch({ type: LOADING });
    API.getPrints()
      .then(results => {
        const cart = results.data.filter(print => state.cart.includes(print._id));
        let checked = {};
        let subtotal = 0;
        
        // Set initial checks and subtotal
        cart.forEach(item => {
          checked[item._id] = false;
          subtotal += item.price;
        });

        setCart(cart);
        setChecked(checked);
        setCosts({ ...costs, subtotal });
      })
      .catch(err => console.log(err));  
    dispatch({ type: LOADING });

    // Update local storage. Needed after delete.
    localStorage.setItem('bfg-cart', JSON.stringify([...state.cart]));
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
    const temp = state.cart.filter(item => checked[item] === true);

    temp.forEach(_id => {
      dispatch({
        type: REMOVE_ITEM,
        _id: _id,
      });
    });
  };

  const calculateCost = () => {
    let taxes = 0;
    let shipping = 5;
    let total = costs.subtotal + taxes + shipping;

    setCosts({ ...costs, taxes, shipping, total });
  };

  useEffect(() => {
    getCart();
  }, [state.cart]);

  useEffect(() => {
    calculateCost();
  }, [costs.shipping])

  return (
    <div className={classes.root}>
      <Hero default={true}>
        <div className={classes.cart}>
          <Container maxWidth='sm' justify='center' style={{ padding: 4 }}>
            <Paper className={classes.paper} elevation={0} square>
              <Grid container>
                <Grid item xs={12}>
                  <Typography align='left' component='h2' variant='h4' color='textPrimary'>
                    Your Cart
                  </Typography>
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
                        <Grid container>
                          <Grid item xs={2} align='center' className={classes.checkbox}>
                            <Checkbox
                              checked={checked[print._id] || false}
                              color='primary'
                              inputProps={{ 'aria-label': 'select item'}}
                              name={print._id}
                              onChange={handleChange}
                            />
                          </Grid>
                          <Grid item xs={3} sm={4}>
                            <Image src={print.image} className={classes.image} />
                          </Grid>
                          <Grid item xs={7} sm={6} className={classes.info}>
                            <Grid container>
                              <Grid item xs={12} sm={6}>
                                <Typography variant={xs ? 'h6' : 'h5'} color='textPrimary' className={classes.title}>
                                  {print.name}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <Typography variant={xs ? 'body1' : 'h5'} color='textPrimary' align={xs ? 'left' : 'right'}>
                                  ${print.price.toFixed(2)}
                                </Typography>
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
                <Grid item xs={12}>
                  <Typography variant='h6' align='right'>
                    Total
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography component='p' variant='body1' align={xs ? 'left' : 'right'}>
                    Subtotal:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography component='p' variant='body2' align='right'>
                    {costs.subtotal === 0 ? '$0.00' : `$${costs.subtotal.toFixed(2)}`}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography component='p' variant='body1' align={xs ? 'left' : 'right'}>
                    Taxes:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography component='p' variant='body2' align='right'>
                    {costs.taxes === 0 ? '$0.00' : `$${costs.taxes.toFixed(2)}`}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography component='p' variant='body1' align={xs ? 'left' : 'right'}>
                    Shipping:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography component='p' variant='body2' align='right'>
                    {costs.shipping === 0 ? '$0.00' : `$${costs.shipping.toFixed(2)}`}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography component='p' varaint='body1' align='right' className={classes.total}>
                    {costs.total === 0 ? '$0.00' : `$${costs.total.toFixed(2)}`}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={12} align='center'>
                  <ThemeProvider theme={localTheme}>
                    <Button
                      variant='contained'
                      color='secondary'
                      className={classes.button}
                      fullWidth={xs ? true : false}
                      disableElevation
                      size='large'
                      onClick={handleDelete}
                    >
                      Remove Selected
                    </Button>
                  </ThemeProvider>
                </Grid>
                <Grid item xs={12} align='center'>
                  <StripeCheckoutBtn 
                    xs={xs}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Container>
        </div>
      </Hero>
    </div>
  );
}

export default Cart;
