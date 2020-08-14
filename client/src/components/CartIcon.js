import React from 'react';
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

export default function CartIcon() {
  const [state, _] = useStoreContext();
  const classes = useStyles();

  return (
    <IconButton aria-label='cart'>
      <Badge className={classes.badge} badgeContent={state.cart.length} color='secondary'>
        <ShoppingCartIcon className={classes.cartIcon} />
      </Badge>
    </IconButton>
  );
}
