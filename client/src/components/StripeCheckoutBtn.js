import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { useStoreContext } from '../utils/GlobalState';
import { LOADING } from '../utils/actions';
import API from '../utils/API';

const useStyles = makeStyles((theme) => ({
  button: {
    marginTop: theme.spacing(1),
    minWidth: 224,
  },
}));

const fetchCheckoutSession = async (cart, user) => {
  const { data } = await API.createCheckoutSession(cart, user);
  return { sessionId: data.sessionId };
};

export default function StripeCheckoutBtn(props) {
  const classes = useStyles();
  const [stripe, setStripe] = useState(null);
  const [error, setError] = useState(null);
  const [state, dispatch] = useStoreContext();

  useEffect(() => {
    async function fetchConfig() {
      // Fetch config from backend.
      const { data } = await API.getStripeConfig();

      // Make sure to call 'loadStripe' outside of a component's render
      // to avoid recreating the Stripe object on every render.
      setStripe(await loadStripe(data.publicKey));
    }
    fetchConfig();
  }, []);

  const handleClick = async (event) => {
    // Call backend to create Checkout session.
    dispatch({ type: LOADING });
    const { sessionId } = await fetchCheckoutSession({
      cart: state.cart,
      user: state.user
    });

    // When customer clicks on the button, redirect them to checkout.
    const { error } = await stripe.redirectToCheckout({ sessionId });

    // If 'redirectToCheckout' fails due to a browser or network error,
    // display the localized error message to the customer.
    if (error) {
      setError(error);
      dispatch({ type: LOADING });
    }
  };

  return (
    <Button
      variant='contained'
      color='primary'
      className={classes.button}
      fullWidth={props.xs ? true : false}
      disableElevation
      size='large'
      onClick={handleClick}
      disabled={!stripe || state.loading || state.cart.length < 1}
    >
      Proceed to Checkout
    </Button>
  );
}
