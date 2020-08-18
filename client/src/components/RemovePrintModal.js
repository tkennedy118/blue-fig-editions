import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import RemovePrint from './RemovePrint';

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
    border: `2px solid ${theme.palette.primary.main}`,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function RemovePrintModal(props) {
  const classes = useStyles();

  const handleClose = () => {
    props.setRemove(false);
  };

  const handleRemove = () => {
    RemovePrint(props._id, props.dispatch);
    props.setRemove(false);
  };

  return (
    <div> 
      <Modal
        className={classes.modal}
        open={props.remove}
        onClose={handleClose}
        aria-describedby='remove-print-modal-description'
      >
        <div className={classes.paper}>
          <p id='remove-print-modal-description'>
            Are you sure you would like to remove this print?
          </p>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Button variant='outlined' color='primary' fullWidth onClick={handleRemove}>
                Yes
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button variant='contained' color='primary' fullWidth onClick={() => props.setRemove(false)}>
                No
              </Button>
            </Grid>
          </Grid>
        </div>
      </Modal>
    </div>
  );
}
