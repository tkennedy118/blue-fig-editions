import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import SendIcon from '@material-ui/icons/Send';
import HandleAlert from '../components/HandleAlert';
import Loader from '../components/Loader';
import API from '../utils/API';

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
    from: '',
    subject: '',  
    text: ''
  });
  const [error, setError] = useState({ 
    name: false,
    from: false,
    subject: false,
    text: false
  });

  useEffect(() => {
    setState({
      ...state,
      subject: props.subject,
      text: props.message
    });
  }, [props.subject, props.message])

  async function sendEmail() {
    setLoading(true);
    await API.sendEmail({
      name: state.name,
      from: state.from,
      subject: state.subject,
      text: state.text
    })
      .then((result) => {
        setOpen({ ...open, success: true });
      })
      .catch((error) => {
        setOpen({ ...open, failure: true })
      });
    setLoading(false);

    setState({
      name: '',
      from: '',
      subject: '',
      text: ''
    });
  }

  function handleChange(event) {
    if (error.name || error.from || error.subject || error.text ) {
      setError({ name: false, from: false, subject: false, text: false });
    }

    const name = event.target.name;
    setState({ ...state, [name]: event.target.value });

    // Validation
    if (name === 'from' && !event.target.value.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) {
      setError({ ...error, from: true });
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    // validation
    if (state.name === '') { 
      setError({ ...error, name: true }); 
      return;
    }
    if (state.from === '') { 
      setError({ ...error, from: true }); 
      return; 
    }
    if (state.subject === '') {
      setError({ ...error, subject: true });
      return
    }
    if (state.text === '') {
      setError({ ...error, text: true});
      return;
    }

    // Everything is valid. Rebuild email format before sending.
    sendEmail();
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
            value={state.from}
            required
            type='email'
            id='from'
            name='from'
            label='Email'
            variant='outlined'
            fullWidth
            onChange={handleChange}
            error={error.from ? true : false}
            helperText={error.from ? 'Please enter email' : ''}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            value={state.subject}
            required
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
            value={state.text}
            required
            id='text'
            name='text'
            label='Message'
            variant='outlined'
            multiline
            rows={4}
            rowsMax={4}
            fullWidth
            onChange={handleChange}
            error={error.text ? true : false}
            helperText={error.text ? 'Please enter message' : ''}
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
