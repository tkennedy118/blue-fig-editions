import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import PublishIcon from '@material-ui/icons/Publish';
import HandleAlert from '../components/HandleAlert';
import { useStoreContext } from '../utils/GlobalState';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  input: {
    display: 'none',
  },
}));

export default function AddPrintCard(props) {
  const [state, dispatch] = useStoreContext();
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);

  return (
    <>
      <CardContent>
        <Typography variant='h6' style={{ marginBottom: '24px' }}>
          New Print
        </Typography>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <TextField
              required
              id='name'
              name='name'
              label='Title'
              variant='outlined'
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id='series'
              name='series'
              label='Series'
              variant='outlined'
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              id='price'
              name='price'
              label='Price'
              type='number'
              variant='outlined'
              fullWidth
            />
          </Grid>
          <Grid item xs={12} style={{ marginBottom: '24px' }}>
            <TextField
              id='description'
              name='description'
              label='Description'
              variant='outlined'
              multiline
              rows={3}
              rowsMax={4}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <input
              required
              accept='*.png'
              className={classes.input}
              id='upload-img-btn'
              type='file'
            />
            <label htmlFor='upload-img-btn'>
              <Button variant='contained' color='primary' component='span' fullWidth startIcon={<PublishIcon/>}>
                Upload Image
              </Button>
            </label>
          </Grid>
          <Grid item xs={6}>
            <Button variant='outlined' fullWidth color='secondary' startIcon={<DeleteIcon/>} onClick={() => props.setAddNew(false)}>
              Delete
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button variant='outlined' fullWidth color='primary' startIcon={<ArrowUpwardIcon/>}>
              Submit
            </Button>
          </Grid>
        </Grid>
      </CardContent>
      <HandleAlert open={open} setOpen={setOpen} message='Print added to webstie.' severity='success' />
      <HandleAlert open={open} setOpen={setOpen} message='Print was not added to website.' severity='error' />
    </>
  );
}
