import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import UndoIcon from '@material-ui/icons/Undo';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import PublishIcon from '@material-ui/icons/Publish';
import HandleAlert from '../components/HandleAlert';
import Loader from './Loader';
import { useStoreContext } from '../utils/GlobalState';
import API from '../utils/API';
import AddPrint from '../utils/functions/AddPrint';
import UpdatePrint from '../utils/functions/UpdatePrint';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  input: {
    display: 'none',
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  switch: {
    marginTop: theme.spacing(2),
  },
}));

export default function PrintForm(props) {
  const [state, dispatch] = useStoreContext();
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    name: false,
    description: false,
    img: false
  });
  const [selectedImage, setSelectedImage] = useState('');
  const [newPrint, setNewPrint] = useState({
    name: '',
    series: '',
    price: 0,
    quantity: 0,
    description: '',
    image: '',
    featured: false,
    about: ''
  });

  useEffect(() => {
    if (props.update) {
      setNewPrint({
        _id: props._id,
        name: props.name,
        series: props.series,
        price: props.price,
        quantity: props.quantity,
        description: props.description,
        image: '',
        featured: props.featured,
        about: props.about
      })
    }
  }, [props._id, props.name, props.series, props.price, props.quantity, 
      props.description, props.featured, props.about, props.update]);

  async function handleChangeImg(event) {
    // validation
    if (!event.target.value.match(/\.(jpg|jpeg|png|gif)$/)) {
      setError({ ...error, img: true });
      return;
    }
    
    const file = event.target.files[0];
    const reader = new FileReader();
    
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setSelectedImage(reader.result);
    }

    setNewPrint({ ...newPrint, image: file.name });
  };

  const toggleChecked = (event) => {
    setNewPrint({ ...newPrint, featured: event.target.checked });
  };

  function handleChange(event) {
    if (error.name || error.description || error.img ) {
      setError({ name: false, description: false, img: false });
    }

    const name = event.target.name;
    setNewPrint({ ...newPrint, [name]: event.target.value })
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const names = state.prints.map((print) => print.name);
    const length = newPrint.description.length;

    // validation
    if ((!props.update && names.includes(newPrint.name)) || newPrint.name === '') { 
      setError({ ...error, name: true }); 
      return;
    }
    if (length < 15 || length > 128) { 
      setError({ ...error, description: true }); 
      return; 
    }
    if (newPrint.image.length < 1 || !selectedImage) {
      setError({ ...error, img: true });
      return;
    }

    // Cloudinary
    const print = await uploadImage(selectedImage);

    if (print.image) {
      // send data to api and update state
      (!props.update) ? AddPrint(print, dispatch) : UpdatePrint(print, dispatch);
    } else { return; }

    props.exitForm(false);
  }

  const uploadImage = async (base64EncodedImage) => {
    let print = newPrint;

    try {
      setLoading(true);
      const { data } = await API.uploadImage({ data: base64EncodedImage });
      setLoading(false);

      print.image = data.url;
    } catch {
      setLoading(false);
      setError({ ...error, img: true });

      print.image = false;
    }

    return print;
  }

  return (
    <>
      <CardHeader
        action={
          <FormControlLabel
            control={
              <Switch 
                checked={newPrint.featured} 
                onChange={toggleChecked} 
                name='featured' 
                color='primary' />
            }
            label='Featured'
            labelPlacement='top'
            className={classes.switch}
          />
        }
        title={!props.update ? 'New Print' : 'Update Print'}
      />
      <CardContent>
        <form>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <TextField
                value={newPrint.name}
                required
                id='name'
                name='name'
                label='Title'
                variant='outlined'
                fullWidth
                onChange={handleChange}
                error={error.name ? true : false}
                helperText={error.name ? 'Title must be unique': ''}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                value={newPrint.series}
                id='series'
                name='series'
                label='Series'
                variant='outlined'
                fullWidth
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                value={newPrint.price}
                required
                id='price'
                name='price'
                label='Price'
                type='number'
                variant='outlined'
                fullWidth
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                value={newPrint.quantity}
                required
                id='quantity'
                name='quantity'
                label='Quantity'
                type='number'
                variant='outlined'
                fullWidth
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                value={newPrint.description}
                id='description'
                name='description'
                label='Description'
                variant='outlined'
                multiline
                rows={3}
                rowsMax={4}
                fullWidth
                onChange={handleChange}
                error={error.description ? true : false}
                helperText={error.description ? 'Description must be between 15 and 40 characters' : ''}
              />
            </Grid>
            {newPrint.featured
              ?
                <Grid item xs={12}>
                  <TextField
                    value={newPrint.about}
                    id='about'
                    name='about'
                    label='Featured Description'
                    variant='outlined'
                    multiline
                    rows={3}
                    rowsMax={5}
                    fullWidth
                    onChange={handleChange}
                  />
                </Grid>
              :
                <></>
            }
            <Grid item xs={12}>
            <Typography variant='subtitle1' color='primary' align='left' gutterBottom noWrap>
              {error.img
                ?
                  <Typography variant='subtitle1' color='error' align='left'>Image upload failed</Typography>
                :
                  newPrint.image.length > 0 ? newPrint.image : 'File path'
              }
            </Typography>
              <input
                required
                accept='image/*'
                className={classes.input}
                id='upload-img-btn'
                name='img'
                type='file'
                onChange={handleChangeImg}
                onClick={() => setError({ ...error, img: false })}
                style={{ display: 'none' }}
              />
              <label htmlFor='upload-img-btn'>
                <Button variant='contained' color='secondary' component='span' fullWidth disableElevation startIcon={<PublishIcon/>}>
                  Upload Image
                </Button>
              </label>
            </Grid>
            <Grid item xs={6}>
              <Button variant='outlined' fullWidth color='secondary' startIcon={<UndoIcon/>} onClick={() => props.exitForm(false)}>
                Undo
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button type='submit' variant='outlined' fullWidth color='secondary' startIcon={<ArrowUpwardIcon/>} onClick={handleSubmit}>
                {!props.update ? 'Submit' : 'Update'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
      <HandleAlert open={open} setOpen={setOpen} message='Print added to webstie.' severity='success' />
      <HandleAlert open={open} setOpen={setOpen} message='Print was not added to website.' severity='error' />
      <Loader loading={loading} />
    </>
  );
}
