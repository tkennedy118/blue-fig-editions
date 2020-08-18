import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

export default function Loader(props) {
  const classes = useStyles();

  return(
    <Backdrop className={classes.backdrop} open={props.loading}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}
