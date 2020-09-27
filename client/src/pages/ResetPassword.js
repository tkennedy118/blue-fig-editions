import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import { useStoreContext } from '../utils/GlobalState';
import { LOADING } from '../utils/actions';
import Loader from '../components/Loader';
import API from '../utils/API';
import Tara from '../utils/images/tara.jpg';

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
  center: {
    padding: theme.spacing(2, 0),
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    marginBottom: theme.spacing(2),
  },
}));

export default function ResetPassword(props) {
  const classes = useStyles();
  const hash = props.match.params.hash;

  const [state, dispatch] = useStoreContext();
  const [password, setPassword] = useState({ password: '', verify: '' });
  const [error, setError] = useState({ password: false, verify: false, response: false});
  const [response, setResponse] = useState({ error: false, success: false });

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    
    if (error.password || error.verify) { setError({ password: false, verify: false, response: false }); }
    if (response.error || response.success) { setResponse({ error: false, success: false }); }

    // Validation
    switch(name) {
      case 'password':
        if (!value.match(/^([a-zA-Z0-9!@#$%^&*]{8,16})$/)) {
          setError({ ...error, password: true });
        }
        if (password.verify.length > 0 && value !== password.verify) {
          setError({ ...error, verify: true });
        }
        break;
        case 'verify':
        if (value !== password.password) {
          setError({ ...error, verify: true });
        }
        break;
      default:
        break;
    }

    setPassword({ ...password, [name]: value });
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!error.password && !error.verify && password.password !== '' && password.verify !== '') {
      // Do the stuff.

      dispatch({ type: LOADING });
      const { data } = await API.resetPassword({
        password: password.password,
        hash: hash
      })
      dispatch({ type: LOADING });

      if (data.success) {
        setResponse({ ...response, success: true });
      } else {
        setResponse({ ...response, error: true });
      }
    }
  }

  return(
    <Grid container className={classes.root}>
      <CssBaseline />
      <Grid item xs={12} sm={7} md={5}>
        <div className={classes.center}>
          <Container maxWidth='xs'>
            <Grid container component='main' alignItems='center' justify='center' spacing={1}>
              <Grid item xs={12}>
                <Typography component='h2' variant='h6' paragraph>
                  Blue Fig Editions
                </Typography>
                <Typography variant='body1'>
                  Enter a password that includes the following:
                </Typography>
                <Typography variant='body2' color='textSecondary'>
                  Length of 8 to 16
                </Typography>
                <Typography variant='body2' color='textSecondary'>
                  At least 1 special character
                </Typography>
              </Grid>
              <Grid item xs={12} style={{ marginTop: 36 }}>
                <TextField
                  value={password.password}
                  id='password'
                  name='password'
                  type='password'
                  label='Password'
                  variant='outlined'
                  color='primary'
                  size='small'
                  fullWidth
                  onChange={handleChange}
                  error={error.password ? true : false}
                  helperText={error.password ? 'Pleas enter a valid password' : ''}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  value={password.verify}
                  id='verify'
                  name='verify'
                  type='password'
                  label='Re-enter password'
                  variant='outlined'
                  color='primary'
                  size='small'
                  fullWidth
                  onChange={handleChange}
                  error={error.verify ? true : false}
                  helperText={error.verify ? 'Passwords do not match' : ''}
                />
              </Grid>
              <Grid item xs={12}>
                <Button variant='contained' disableElevation fullWidth onClick={handleSubmit}>
                  Update Password
                </Button>
              </Grid>
              <Grid item xs={12}>
                {response.error
                  ?
                    <Typography variant='body2' color='error' className={classes.message} align='center'>
                      Uh oh! Something went wrong while attempting to update your password.
                    </Typography>
                  :
                    <></>
                }
                {response.success
                  ?
                    <Typography variant='body2' color='secondary' className={classes.message} align='center'>
                      Your password has been updated!
                    </Typography>
                  :
                    <></>
                }
              </Grid>
              <Grid item xs={12}>
                <Link href='/signin' variant='body2'>
                  Go back to Sign In
                </Link>
              </Grid>
            </Grid>
          </Container>
        </div>
      </Grid>
      <Grid item xs={false} sm={5} md={7} className={classes.image} />
      <Loader loading={state.loading} />
    </Grid>
  );
}
