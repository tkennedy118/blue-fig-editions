import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';

function Alert(props) {
  return <MuiAlert elevation={6} variant='filled' {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function HandleAlert(props) {
  const classes = useStyles();

  const handleClose = (reason) => {
    if (reason === 'clickaway') {
      return;
    }

    props.setOpen(false);
  };

  return (
    <div className={classes.root}>
      <Snackbar 
        open={props.open} 
        autoHideDuration={1700} 
        onClose={() => props.setOpen(false)}
      >
        <Alert onClose={handleClose} severity='success'>
          {props.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
