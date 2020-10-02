import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Radio from '@material-ui/core/Radio';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { states } from '../utils/states';
import { useStoreContext } from '../utils/GlobalState';
import { LOADING, UPDATE_ADDRESS, UPDATE_SHIPPING } from '../utils/actions';
import API from '../utils/API';

const countries = [{
  value: 'US',
  label: 'US'
}]

const useStyles = makeStyles((theme) => ({
  calulateShippingBtn: {
    marginTop: theme.spacing(2),
  },
  paper: {
    margin: theme.spacing(1, 0),
    padding: theme.spacing(1),
  },
  rate: {
    fontWeight: 'bold'
  }
}));

export default function ShippingForm(props) {
  const classes = useStyles();
  const [state, dispatch] = useStoreContext();
  const [error, setError] = useState({
    name: false,
    street1: false,
    city: false,
    state: false,
    country: false,
    zip: false
  });
  const [rates, setRates] = useState([]);
  const [radio, setRadio] = useState('');
  const [checks, setChecks] = useState({
    searchedAddress: false,
    foundAddress: false,
  });

  const checkDisabled = () => {
    let temp = ({
      name: state.address.name,
      street1: state.address.street1,
      city: state.address.city,
      state: state.address.state,
      zip: state.address.zip,
      country: state.address.country
    });

    return Object.values(temp).includes('');
  };
  
  const handleChange = (event) => {
    setError({ name: false, street1: false, city: false, zip: false });
    setChecks({ searchedAddress: false, foundAddress: false });

    const name = event.target.name;

    dispatch({
      type: UPDATE_ADDRESS,
      address: { ...state.address, [name]: event.target.value }
    });

    // Validation
    if (event.target.value === '') {
      switch (name) {
        case 'name':
          setError({ ...error, name: true });
          break;
        case 'street1':
          setError({ ...error, street1: true });
          break;
        case 'city':
          setError({ ...error, city: true });
          break;
        case 'state':
          setError({ ...error, state: true });
          break;
        case 'country':
          setError({ ...error, country: true });
          break;
        case 'zip':
          setError({ ...error, zip: true });
          break;
        default:
          break;
      }
    }
  }

  const handleRadioChange = (event) => {
    setRadio(event.target.value);
    const chosen = rates.find(rate => rate.id === event.target.value);
    const shipping = parseFloat(chosen.rate);
    const taxes = ((props.costs.subtotal + shipping) * .0925);

    props.setCosts({ ...props.costs, shipping: shipping, taxes: taxes });
    dispatch({
      type: UPDATE_SHIPPING,
      shipping: { ...state.shipping, rate_id: event.target.value }
    });
  };

  // Not necessarily permanent. May try to update this function later.
  const getParcel = (cart) => {
    let count = 0;
    cart.forEach(item => { count += item.quantity });

    console.log('COUNT: ', count);
    return({
      length: 22,
      width: 20,
      height: 2,
      weight: .25 * count
    });
  };

  const getRates = async (shipment_id) => {
    const response = await API.retrieveShipment(shipment_id);
    setRates([...response.data.rates]);
  };

  // Steps for getting shipping options:
  // 1. Create Address
  // 2. Create Parcels
  // 3. Create Shipment
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      let addr;
      let parcel;
      
      // 1. Create Address
      dispatch({ type: LOADING });
      let response = await API.createAddress({ address: state.address });
      addr = response.data;

      // 2. Create Parcel
      response = await API.createParcel({ parcel: getParcel(state.cart) });
      parcel = response.data;
      
      // 3. Create Shipment
      response = await API.createShipment({ toAddress: addr.id, parcel: parcel.id });
      getRates(response.data.id);

      setChecks({ searchedAddress: true, foundAddress: true });
      dispatch({
        type: UPDATE_SHIPPING,
        shipping: { ...state.shipping, shipment_id: response.data.id }
      });
      dispatch({
        type: UPDATE_ADDRESS,
        address: {
          name: addr.name,
          street1: addr.street1,
          street2: addr.street2,
          city: addr.city,
          state: addr.state,
          zip: addr.zip,
          country: addr.country
        }
      });
  
    } catch (err) {
      setChecks({ searchedAddress: true, foundAddress: false });
      dispatch({ type: LOADING });
    }
  };

  return (
    <>
      <Typography variant='h6' gutterBottom>
        Shipping address
      </Typography>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <TextField
            required
            value={state.address.name}
            id='name'
            name='name'
            label='Full Name'
            variant='outlined'
            onChange={handleChange}
            fullWidth
            autoComplete='given-name'
            error={error.name ? true : false}
            helperText={error.name ? 'Please enter name' : ''}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            value={state.address.street1}
            id='street1'
            name='street1'
            label='Address line 1'
            variant='outlined'
            onChange={handleChange}
            fullWidth
            autoComplete='shipping address-street1'
            error={error.street1 ? true : false}
            helperText={error.street1 ? 'Please enter address' : ''}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id='street2'
            value={state.address.street2}
            name='street2'
            label='Address line 2'
            variant='outlined'
            onChange={handleChange}
            fullWidth
            autoComplete='shipping address-street2'
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            value={state.address.city}
            id='city'
            name='city'
            label='City'
            variant='outlined'
            onChange={handleChange}
            fullWidth
            autoComplete='shipping address-level2'
            error={error.city ? true : false}
            helperText={error.city ? 'Please enter city' : ''}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField 
            required
            select
            value={state.address.state}
            id='state' 
            name='state' 
            label='State/Province/Region'
            variant='outlined'
            onChange={handleChange}
            fullWidth 
          >
            {states.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            value={state.address.zip}
            id='zip'
            name='zip'
            label='Zip / Postal code'
            variant='outlined'
            onChange={handleChange}
            fullWidth
            autoComplete='shipping postal-code'
            error={error.zip ? true : false}
            helperText={error.zip ? 'Please enter zip code' : ''}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            select
            value={state.address.country}
            id='country'
            name='country'
            label='Country'
            variant='outlined'
            onChange={handleChange}
            fullWidth
            autoComplete='shipping country'
          >
            {countries.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        {checks.searchedAddress && !checks.foundAddress && !state.loading
          ?
            <Grid item xs={12}>
              <Typography variant='body2' color='error' align='center'>
                No postage options were found for the given address.
              </Typography>
            </Grid>
          :
            <></>
        }
        <Grid item xs={12}>
          <Button 
            variant='contained' 
            color='primary' 
            disableElevation 
            fullWidth 
            className={classes.calulateShippingBtn}
            onClick={handleSubmit}
            disabled={checkDisabled()}
          >
              Get Options
          </Button>
        </Grid>
      </Grid>
      {rates.length > 0
        ?
          <>
            <Typography variant='h6' gutterBottom style={{ marginTop: 24 }}>
              Shipping Options
            </Typography>
            {rates.map(rate => {
              return(
                <Paper key={rate.id} className={classes.paper} variant='outlined' elevation={0}>
                  <Grid container spacing={1} alignItems='center'>
                    <Grid item xs={2}>
                      <Radio 
                        checked={radio === rate.id} 
                        value={rate.id} name='postage-radio' 
                        inputProps={{ 'aria-label': rate.service }} 
                        onChange={handleRadioChange}
                      />
                    </Grid>
                    <Grid item xs={10}>
                      <Grid container spacing={1}>
                        <Grid item xs={6}>
                          <Typography variant='body2' align='right'>
                            {rate.carrier}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant='body2' align='right' className={classes.rate}>
                            ${rate.rate}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant='body2' align='right'>
                            {rate.service.split(/(?=[A-Z])/)}
                          </Typography>
                        </Grid>
                        <Grid item item xs={6}>
                          <Typography variant='body2' align='right'>
                            {rate.est_delivery_days ? `${rate.est_delivery_days} Days` : ''}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Paper>
              );
            })}
          </>
        :
          <></>
      }
    </>
  );
}
