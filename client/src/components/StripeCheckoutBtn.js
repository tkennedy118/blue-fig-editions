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
  },
}));

const fetchCheckoutSession = async (cart, user, shipping, address) => {
  const { data } = await API.createCheckoutSession(cart, user, shipping, address);
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

  const handleClick = async () => {
    // Call backend to create Checkout session.
    dispatch({ type: LOADING });
    const { sessionId } = await fetchCheckoutSession({
      cart: state.cart,
      user: state.user,
      shipping: state.shipping,
      address: state.address
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
      disableElevation
      onClick={handleClick}
      disabled={
        !stripe || state.loading || state.cart.length < 1 || state.shipping === 0 ||
        state.shipping.shipment_id.length === 0 || state.shipping.rate_id.length === 0 ||
        !state.isLoggedIn
      }
    >
      Add Payment
    </Button>
  );
}
