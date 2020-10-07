import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import HandleAlert from '../components/HandleAlert';
import { LOADING, UPDATE_EMAIL } from '../utils/actions';
import { useStoreContext } from '../utils/GlobalState';
import API from '../utils/API';

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    marginLeft: '-8px',
    marginRight: '-8px',
  },
  paper: {
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(1),
  },
  form: {
    marginTop: theme.spacing(8),
  },
  container: {
    marginBottom: theme.spacing(2),
  },
  title: {
    marginBottom: theme.spacing(8),
  },
  noPurchases: {
    fontStyle: 'italic',
  },
  transactionText: {
    margin: theme.spacing(1),
    fontWeight: 'bold',
  },
  divider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  }
}));

function Profile(props) {
  const classes = useStyles();
  const id = props.match.params.id;
  const [state, dispatch] = useStoreContext();
  const [purchases, setPurchases] = useState([]);

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
  });
  
  // Handle alert to display success or failure.
  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState({
    message: '',
    severity: ''
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
        setAlert({ message: 'Email update successful', severity: 'success' });
      } else {
        setAlert({ message: 'Email update unsuccessful', severity: 'error' });
        dispatch({ type: LOADING });
      }
      
    } catch(err) {
      setAlert({ message: 'Email update unsuccessful', severity: 'error '});
      dispatch({ type: LOADING });
    }
    setOpen(true);
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
        setAlert({ message: 'Password update successful', severity: 'success' });
      } else {
        setAlert({ message: 'Password update unsuccessful', severity: 'error' });
      }
      
    } catch(err) {
      setAlert({ message: 'Password update unsuccessful', severity: 'error' });
    }
    dispatch({ type: LOADING });
    setInput({ ...input, password: '', validatePassword: '', currentPassword: '' });
    setOpen(true);
  }

  const displayPurchase = purchase => {
    return (
      <Grid container>
        <Grid item xs={12} className={classes.divider}>
          <Divider/>
        </Grid>
        <Grid item xs={6} sm={4}>
          <Typography variant='body1' align='left' className={classes.transactionText}>
            {purchase.date.toDateString()}
          </Typography>
        </Grid>
        <Grid item xs={6} sm={4}>
          <Typography variant='body1' align='right' className={classes.transactionText}>
            {`(${purchase.numItems}) items`}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Button
            variant='contained'
            color='primary'
            href={`/payment?success=true&session_id=${purchase.sessionId}`}
            target='_blank' 
            rel='noreferrer'
            fullWidth
            disableElevation
          >
            View
          </Button>
        </Grid>
      </Grid>
    );
  };

  useEffect(() => {
    async function fetchData() {
      let purchases = [];
      let { data } = await API.getUser(state.user._id);
      
      dispatch({ type: LOADING });
      for await (const purchaseId of data.purchases) {
        const { data } = await API.getPurchase(purchaseId);

        if (data) { 
          const session = await API.getSession(data.session_id);
          const shipment = await API.retrieveShipment(data.purchase_id);
          const date = new Date(shipment.data.created_at);

          purchases.push({
            paymentStatus: session.data.payment_status,
            sessionId: session.data.id,
            date: date,
            label: shipment.data.postage_label.label_url,
            numItems: session.data.line_items.data.length - 2
          });
        }
      }
      dispatch({ type: LOADING });

      purchases.sort((a, b) => b.date - a.date);
      setPurchases(purchases);
    }
    fetchData();
  }, []);

  return (
    <div className={classes.root}>
      <Container maxWidth='sm' className={classes.container}>
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
      <Container maxWidth='sm' className={classes.container}>
        <Grid container>
          <Grid item xs={12}>
            <Paper variant='outlined' elevation={0} className={classes.paper}>
              <Grid container>
                <Grid item xs={12}>
                  <Typography component='h2' variant='h5' align='center' className={classes.title}>
                    Transaction History
                  </Typography>
                  {purchases.length > 0
                    ?
                      <>
                        {purchases.map(purchase => {
                          return(
                            <div key={purchase.sessionId}>
                              {displayPurchase(purchase)}
                            </div>
                          );
                        })}
                      </>
                    :
                      <Typography variant='body1' align='center' className={classes.noPurchases}>
                        No purchase history
                      </Typography>
                  }
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>
      {setOpen
        ?
          <HandleAlert
            open={open}
            setOpen={setOpen}
            message={alert.message}
            severity={alert.severity}
          />
        :
          <></>
      }
      {!state.isLoggedIn || state.user._id !== id ? <Redirect push to='/home' /> : <></>}
    </div>
  );
}

export default Profile;
