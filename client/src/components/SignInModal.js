import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    position: 'absolute',
    width: 300,
    backgroundColor: theme.palette.background.default,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  body: {
    margin: theme.spacing(2, 0, 3),
    fontWeight: 'bold',
  },
}));

export default function SignInModal(props) {
  const classes = useStyles();

  const handleClose = () => {
    props.setModal(false);
  };

  return (
    <div> 
      <Modal
        className={classes.modal}
        open={props.modal}
        onClose={handleClose}
        aria-describedby='sign-in-modal-description'
      >
        <div className={classes.paper}>
          <Typography id='sign-in-modal-description' variant='subtitle1' color='textPrimary' className={classes.body} align='center'>
            Please Sign In to continue checkout.
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Button component={Link} href='/signin' variant='outlined' color='secondary' disableElevation fullWidth onClick={handleClose}>
                Sign In
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button component={Link} href='/signup' variant='contained' color='primary' disableElevation fullWidth onClick={handleClose}>
                Sign Up
              </Button>
            </Grid>
          </Grid>
        </div>
      </Modal>
    </div>
  );
}