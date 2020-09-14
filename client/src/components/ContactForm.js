import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import SendIcon from '@material-ui/icons/Send';
import HandleAlert from '../components/HandleAlert';
import Loader from '../components/Loader';

const useStyles = makeStyles((theme) => ({
  submit: {
    marginBottom: theme.spacing(2),
    height: 48,
  },
  form: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

export default function ContactFrom(props) {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState({
    success: false,
    failure: false
  });
  const [state, setState] = useState({
    name: '',
    email: '',
    subject: props.subject,
    message: props.message
  });
  const [error, setError] = useState({ 
    name: false,
    email: false,
    subject: false,
    message: false
  });

  function sendEmail(data) {
    setLoading(true);

    emailjs.send('gmail', 'blue-fig', data, 'user_2ykaMlM7W9u4Q1XssHrYO')
      .then((result) => {
        if (result.text === 'OK') {
          setOpen({ ...open, success: true });
        } else {
          setOpen({ ...open, failure: true });
        }
      }, (error) => {
        setOpen({ ...open, failure: true });
      });
    setLoading(false);

    setState({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  }

  function handleChange(event) {
    if (error.name || error.email || error.subject || error.message ) {
      setError({ name: false, email: false, subject: false, message: false });
    }

    const name = event.target.name;
    setState({ ...state, [name]: event.target.value });

    // Validation
    if (name === 'email' && !event.target.value.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) {
      setError({ ...error, email: true });
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    // validation
    if (state.name === '') { 
      setError({ ...error, name: true }); 
      return;
    }
    if (state.email === '') { 
      setError({ ...error, email: true }); 
      return; 
    }
    if (state.subject === '') {
      setError({ ...error, subject: true });
      return
    }
    if (state.message === '') {
      setError({ ...error, message: true});
      return;
    }

    sendEmail(state);
  }

  return (
    <>
      <Grid container spacing={1} className={classes.form}>
        <Grid item xs={12} sm={6}>
          <TextField
            value={state.name}
            required
            id='name'
            name='name'
            label='Name'
            variant='outlined'
            fullWidth
            onChange={handleChange}
            error={error.name ? true : false}
            helperText={error.name ? 'Please enter name' : ''}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            value={state.email}
            required
            type='email'
            id='email'
            name='email'
            label='Email'
            variant='outlined'
            fullWidth
            onChange={handleChange}
            error={error.email ? true : false}
            helperText={error.email ? 'Please enter email' : ''}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            value={props.subject}
            required
            type='subject'
            id='subject'
            name='subject'
            label='Subject'
            variant='outlined'
            fullWidth
            onChange={handleChange}
            error={error.subject ? true : false}
            helperText={error.subject ? 'Please enter subject' : ''}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            value={props.message}
            required
            id='message'
            name='message'
            label='Message'
            variant='outlined'
            multiline
            rows={4}
            rowsMax={4}
            fullWidth
            onChange={handleChange}
            error={error.message ? true : false}
            helperText={error.message ? 'Please enter message' : ''}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            type='submit'
            fullWidth
            variant='contained'
            color='primary'
            className={classes.submit}
            onClick={handleSubmit}
            disableElevation
            endIcon={<SendIcon />}
          >
            Send
          </Button>
        </Grid>
      </Grid>
      <HandleAlert open={open.success} setOpen={setOpen} message='Email sent successfully' severity='success' />
      <HandleAlert open={open.failure} setOpen={setOpen} message='Email unseccessful' severity='error' />
      <Loader loading={loading} />
    </>
  );
}
