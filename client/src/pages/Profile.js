import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { LOADING, UPDATE_EMAIL } from '../utils/actions';
import { useStoreContext } from '../utils/GlobalState';
import API from '../utils/API';

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh',
    padding: theme.spacing(3, 1),
  },
  paper: {
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(1),
  },
  form: {
    marginTop: theme.spacing(8),
  },
}));

function Profile(props) {
  const classes = useStyles();
  const id = props.match.params.id;
  const [state, dispatch] = useStoreContext();

  const [input, setInput] = useState({
    email: '',
    validateEmail: '',
    password: '',
    validatePassword: '',
    currentPassword: ''
  });
  const [error, setError] = useState({
    email: false,
    validateEmail: false,
    password: false,
    validatePassword: false,
    serverEmail: false, 
    serverPassword: false,
    serverDelete: false
  });

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    if (error.serverEmail || error.serverPassword || error.serverDelete) {
      setError({ ...error, serverEmail: false, serverPassword: false, serverDelete: false })
    }

    // Validation
    switch(name) {
      case 'password':
        if (!value.match(/^([a-zA-Z0-9!@#$%^&*]{8,16})$/)) {
          setError({ ...error, password: true });
        } else {
          setError({ ...error, password: false });
        }
        break;
      case 'validatePassword':
        if (value !== input.password) {
          setError({ ...error, validatePassword: true });
        } else {
          setError({ ...error, validatePassword: false });
        }
        break;
      case 'email':
        if (!value.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) {
          setError({ ...error, email: true });
        } else {
          setError({ ...error, email: false });
        }
        break;
      case 'validateEmail':
        if (value !== input.email) {
          setError({ ...error, validateEmail: true });
        } else {
          setError({ ...error, validateEmail: false });
        }
        break;
    }

    setInput({ ...input, [name]: value });
  }

  const handleSubmitEmail = async (event) => {
    event.preventDefault();

    try {
      dispatch({ type: LOADING });
      const { data } = await API.updateUser(state.user._id, {
        email: input.email
      }, { new: true });

      if (data) {
        dispatch({
          type: UPDATE_EMAIL,
          email: data.email
        });
        setInput({ ...input, email: '', validateEmail: '' });
      } else {
        setError({ ...error, serverEmail: true });
        dispatch({ type: LOADING });
      }

    } catch(err) {
      setError({ ...error, serverEmail: true });
      dispatch({ type: LOADING });
    }
  }

  const handleSubmitPassword = async (event) => {
    event.preventDefault();

    try {
      dispatch({ type: LOADING });
      const { data } = await API.updateUser(state.user._id, {
        password: input.password,
        currentPassword: input.currentPassword
      }, { new: true });

      if (data) {
        setInput({ ...input, password: '', validatePassword: '', currentPassword: '' });
      } else {
        setError({ ...error, serverPassword: true });
      }
      dispatch({ type: LOADING });

    } catch(err) {
      setError({ ...error, serverEmail: true });
      dispatch({ type: LOADING });
    }
  }

  return (
    <>
      <Container maxWidth='sm' className={classes.root}>
        <Grid container>
          <Grid item xs={12}>
            <Paper variant='outlined' elevation={0} className={classes.paper}>
              <Grid container>
                <Grid item xs={12}>
                  <Typography component='h2' variant='h5' align='center'>
                    Your Profile
                  </Typography>
                  <Typography component='h3' variant='subtitle1' align='center'>
                    {state.user.email}
                  </Typography>
                </Grid>
                <Grid item xs={12} className={classes.form}>
                  <form>
                    <Grid container spacing={1}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          value={input.email}
                          variant='outlined'
                          fullWidth
                          id='email'
                          label='Email Address'
                          name='email'
                          type='email'
                          autoComplete='email'
                          size='small'
                          onChange={handleChange}
                          error={error.email ? true : false}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          value={input.validateEmail}
                          variant='outlined'
                          fullWidth
                          id='validateEmail'
                          label='Re-enter email'
                          name='validateEmail'
                          type='email'
                          autoComplete='email'
                          size='small'
                          onChange={handleChange}
                          error={error.validateEmail ? true : false}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Button 
                          variant='contained'
                          color='primary'
                          disableElevation
                          fullWidth
                          onClick={handleSubmitEmail}
                          disabled={input.email === '' || input.validateEmail === '' || error.email || error.validateEmail}
                        >
                          Update Email
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                </Grid>
                <Grid item xs={12} className={classes.form}>
                  <form>
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        <TextField
                          value={input.currentPassword}
                          variant='outlined'
                          fullWidth
                          name='currentPassword'
                          type='password'
                          label='Current password'
                          id='currentPassword'
                          size='small'
                          onChange={handleChange}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          value={input.password}
                          variant='outlined'
                          fullWidth
                          name='password'
                          type='password'
                          label='New password'
                          id='password'
                          size='small'
                          onChange={handleChange}
                          error={error.password ? true : false}
                          helperText={error.password ? 'Password must be between 8 and 16 characters' : ''}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          value={input.validatePassword}
                          variant='outlined'
                          fullWidth
                          name='validatePassword'
                          type='password'
                          label='Re-enter new password'
                          id='validatePassword'
                          size='small'
                          onChange={handleChange}
                          error={error.validatePassword ? true : false}
                          helperText={error.password ? 'Passwords do not match' : ''}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          variant='contained'
                          color='primary'
                          disableElevation
                          fullWidth
                          onClick={handleSubmitPassword}
                          disabled={input.password === '' || input.validatePassword === '' || input.currentPassword === '' || error.password || error.validatePassword}
                        >
                          Update Password
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>
      {!state.isLoggedIn || state.user._id !== id ? <Redirect push to='/home' /> : <></>}
    </>
  );
}

export default Profile;
