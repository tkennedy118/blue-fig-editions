import React, { useState } from 'react';
import { Link as RouterLink, Redirect } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Loader from '../components/Loader';
import Tara from '../utils/images/tara.jpg';
import { useStoreContext } from '../utils/GlobalState';
import { LOGIN, LOADING, LOGOUT } from '../utils/actions';
import API from '../utils/API';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage:`url(${Tara})`,
    backgroundRepeat: 'no-repeat', 
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  error: {
    marginTop: '16px',
    marginBottom: '-12px',
  },
}));


export default function Signup() {
  const classes = useStyles();
  const [state, dispatch] = useStoreContext();
  const [error, setError] = useState({
    email: false,
    password: false,
    server: false
  });
  const [input, setInput] = useState({
    email: '',
    password: '',
  });
  
  function Copyright() {
    return (
      <Typography variant='body2' color='textSecondary' align='center'>
        {'Copyright © '}
        <Link component={RouterLink} to='/'>
          Blue Fig Editions
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }

  const handleChange = (event) => {
    if (error) { setError({ email: false, password: false, server: false }) }

    const name = event.target.name;
    setInput({ ...input, [name]: event.target.value });

    // Validation
    switch (name) {
      case 'email':
        if (!event.target.value.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) {
          setError({ ...error , email: true });
        }
        break;
      case 'password':
        if (!event.target.value.match(/^([a-zA-Z0-9!@#$%^&*]{8,16})$/)) {
          setError({ ...error, password: true });
        }
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      dispatch({ type: LOADING })
      const stripe = await API.createCustomer({ email: input.email });
      const { data } = await API.signup({ 
        email: input.email,
        password: input.password,
        stripe_id: stripe.data.id,
        passwordReset: null,
      });
      
      await API.signin({ email: input.email, password: input.password });
      dispatch({ 
        type: LOGIN,
        _id: data._id,
        stripe_id: data.stripe_id,
        email: data.email,
        isAdmin: data.isAdmin
      });

    } catch(err) {
      dispatch({ type: LOGOUT }); 
      setError({ ...error, server: true });
    }
  }

  return (
    <>
      <Grid container component='main' className={classes.root}>
        <CssBaseline />
        <Grid item xs={false} sm={4} md={7} className={classes.image} />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component='h1' variant='h5'>
              Sign Up
            </Typography>
            {error.server
              ?
                <Typography component='p' variant='body2' color='error' align='center' className={classes.error}>
                  Invalid email or password. The email may already exist under a different account.
                </Typography>
              :
                <></>
            }
            <form className={classes.form} noValidate>
              <TextField
                variant='outlined'
                margin='normal'
                required
                fullWidth
                id='email'
                label='Email Address'
                name='email'
                autoComplete='email'
                autoFocus
                onChange={handleChange}
                error={error.email ? true : false}
              />
              <TextField
                variant='outlined'
                margin='normal'
                required
                fullWidth
                name='password'
                type='password'
                label='Password'
                id='password'
                autoComplete='current-password'
                onChange={handleChange}
                error={error.password ? true : false}
                helperText={error.password ? 'Password must be between 8 and 16 characters' : ''}
              />
              <Button
                type='submit'
                fullWidth
                variant='contained'
                color='primary'
                className={classes.submit}
                onClick={handleSubmit}
                disableElevation
              >
                Sign Up
              </Button>
              <Grid container justify='center'>
                <Grid item>
                  <Link component={RouterLink} to='/signin' variant='body2'>
                    {"Already have an account? Sign In"}
                  </Link>
                </Grid>
              </Grid>
              <Box mt={5}>
                <Copyright />
              </Box>
            </form>
          </div>
        </Grid>
      </Grid>
      <Loader loading={state.loading} />
      {state.isLoggedIn ? <Redirect push to='/home' /> : <></>}
    </>
  );
}
