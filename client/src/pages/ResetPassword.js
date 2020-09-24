import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import HandleAlert from '../components/HandleAlert';
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
  divider: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(1),
  },
  message: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
}));

export default function ResetPassword() {
  const classes = useStyles();
  const [state, dispatch] = useStoreContext();
  const [local, setLocal] = useState({
    error: false,
    loading: false,
    email: ''
  });
  const [hash, setHash] = useState({});

  const createHash = async (email) => {
    dispatch({ type: LOADING });
    const { data } = await API.resetPassword({ email: email });
    dispatch({ type: LOADING });

    // Clear input if hash was successful.
    if (data.success) { setLocal({ ...local, email: '' }); }
    setHash(data);
  }

  const handleChange = (event) => {
    const name = event.target.name;
    let error = false;

    if (local.error) { setLocal({ ...local, error: false }); }
    setHash({});

    // Validation
    if (name === 'email' && !event.target.value.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) {
      error = true;
    }

    setLocal({ ...local, error: error, [name]: event.target.value });
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!local.error) {
      createHash(local.email);
    }
  }

  return(
    <Grid container className={classes.root}>
      <CssBaseline />
      <Grid item xs={12} sm={7} md={5}>
        <div className={classes.center}>
          <Container maxWidth='xs'>
            <Grid container component='main' alignItems='center' justify='center'>
              <Grid item xs={12}>
                <Typography component='h2' variant='h6' paragraph>
                  Blue Fig Editions
                </Typography>
                <Typography variant='body1' paragraph>
                  Enter the email associated with your account, and we'll send you a link to reset your password.
                </Typography>
              </Grid>
              <Grid item xs={12} style={{ marginTop: 48 }}>
                <TextField
                  value={local.email}
                  id='email'
                  name='email'
                  label='Email'
                  variant='outlined'
                  color='primary'
                  size='small'
                  fullWidth
                  onChange={handleChange}
                  error={state.error ? true : false}
                  helperText={state.error ? 'Pleas enter a valid email' : ''}
                />
              </Grid>
              <Grid item xs={12}>
                {hash.error
                  ?
                    <Typography variant='body2' color='error' className={classes.message}>
                      Uh oh! It looks like that email isn't in our system.
                    </Typography>
                  :
                    <></>
                }
                {hash.success
                  ?
                    <Typography variant='body2' color='primary' className={classes.message}>
                      Sending email. Please be sure to check your spam folder if you don't see the email shortly.
                    </Typography>
                  :
                    <></>
                }
              </Grid>
              <Grid item xs={12} style={{ marginTop: 8 }}>
                <Grid container justify='space-between'>
                  <Grid item>
                    <Link component='button' variant='body2' style={{ marginRight: 16 }} onClick={handleSubmit}>
                      Send me a link.
                    </Link>
                  </Grid>
                  <Grid item>
                    <Link href='/signin' variant='body2'>
                      Go back to signin.
                    </Link>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Container>
        </div>
      </Grid>
      <Grid item xs={false} sm={5} md={7} className={classes.image} />
    </Grid>
  );
}
