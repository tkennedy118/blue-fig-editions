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


export default function Signin() {
  const classes = useStyles();
  const [state, dispatch] = useStoreContext();
  const [error, setError] = useState(false);
  const [input, setInput] = useState({
    email: '',
    password: ''
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
    if (error) { setError(false) }

    const name = event.target.name;
    setInput({ ...input, [name]: event.target.value })
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    dispatch({ type: LOADING })
    const { data }= await API.signin({ email: input.email, password: input.password });

    if (!data.message) { 
      dispatch({ 
        type: LOGIN,
        _id: data._id,
        stripe_id: data.stripe_id,
        email: data.email,
        isAdmin: data.isAdmin
      });
      
    } else { 
      dispatch({ type: LOGOUT }); 
      setError(true);
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
              Sign in
            </Typography>
            {error
              ?
                <Typography component='p' variant='body2' color='error' align='center' className={classes.error}>
                  Invalid email or password
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
                type='email'
                id='email'
                label='Email Address'
                name='email'
                autoComplete='email'
                autoFocus
                onChange={handleChange}
                error={error ? true : false}
              />
              <TextField
                variant='outlined'
                margin='normal'
                required
                fullWidth
                name='password'
                label='Password'
                type='password'
                id='password'
                autoComplete='current-password'
                onChange={handleChange}
                error={error ? true : false}
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
                Sign In
              </Button>
              <Grid container justify='space-between'>
                <Grid item>
                  <Link component={RouterLink} to='/reset-password-request' variant='body2' style={{ marginRight: 16 }}>
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link component={RouterLink} to='/signup' variant='body2'>
                    {"Don't have an account? Sign Up"}
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
