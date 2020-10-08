import React, { useState, useEffect } from 'react';
import Badge from '@material-ui/core/Badge';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import { useStoreContext } from '../utils/GlobalState';

const useStyles = makeStyles((theme) => ({
  badge: {
    top: 4,
  },
  cartIcon: {
    color: 'secondary',
  },
}));

export default function CartIcon(props) {
  const [state] = useStoreContext();
  const [length, setLength] = useState(0);
  const classes = useStyles();

  useEffect(() => {
    let count = 0;
    state.cart.forEach(item => {
      count += item.quantity;
    });

    setLength(count);
  }, [state.cart]);

  return (
    props.isButton
      ?
        <IconButton aria-label='cart'>
          <Badge className={classes.badge} badgeContent={length} color='secondary'>
            <ShoppingCartIcon className={classes.cartIcon} />
          </Badge>
        </IconButton>
      :
        <Badge className={classes.badge} badgeContent={state.cart.length} color='secondary'>
          <ShoppingCartIcon className={classes.cartIcon} />
        </Badge>
  );
}
