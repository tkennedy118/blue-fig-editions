import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import PublishIcon from '@material-ui/icons/Publish';
import HandleAlert from '../components/HandleAlert';
import Loader from './Loader';
import { useStoreContext } from '../utils/GlobalState';
import AddPrint from './AddPrint';

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
}));

export default function PrintForm(props) {
  const [state, dispatch] = useStoreContext();
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    name: false,
    description: false,
    img: false
  });
  const [newPrint, setNewPrint] = useState({
    name: '',
    series: '',
    price: 0,
    description: '',
    image: ''
  });

  async function handleChangeImg(event) {
    // validation
    if (!event.target.value.match(/\.(jpg|jpeg|png|gif)$/)) {
      setError({ ...error, img: true });
      return;
    }

    const files = event.target.files;
    const data = new FormData();

    data.append('file', files[0]);
    data.append('upload_preset', 'bluefig');
    
    setLoading(true);
      const res = await fetch(
      'https://api.cloudinary.com/v1_1/tkennedy118/image/upload',
      { method: 'POST', body: data }
    );
    const file = await res.json();
    setLoading(false);
    
    setNewPrint({ ...newPrint, image: file.secure_url });
  };

  function handleChange(event) {
    setError({
      name: false,
      description: false,
      img: false
    });

    const name = event.target.name;
    setNewPrint({ ...newPrint, [name]: event.target.value })
  }

  function handleSubmit(event) {
    event.preventDefault();

    const names = state.prints.map((print) => print.name);
    const length = newPrint.description.length;

    // validation
    if (names.includes(newPrint.name) || newPrint.name === '') { 
      setError({ ...error, name: true }); 
      return;
    }
    if (length < 15 || length > 40) { 
      setError({ ...error, description: true }); 
      return; 
    }
    if (newPrint.image.length < 1) {
      setError({ ...error, img: true });
    }

    // send data to api and update state
    if (!update) { AddPrint(newPrint, dispatch); };

    props.setAddNew(false);
  }

  return (
    <>
      <CardContent>
        <Typography variant='h6' style={{ marginBottom: '24px' }}>
          New Print
        </Typography>
        <Grid container spacing={1} className={classes.helperText}>
          <Grid item xs={12}>
            <TextField
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
              id='series'
              name='series'
              label='Series'
              variant='outlined'
              fullWidth
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
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
          <Grid item xs={12} style={{ marginBottom: '24px' }}>
            <TextField
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
              <Button variant='contained' color='primary' component='span' fullWidth startIcon={<PublishIcon/>}>
                Upload Image
              </Button>
            </label>
          </Grid>
          <Grid item xs={6}>
            <Button variant='outlined' fullWidth color='secondary' startIcon={<DeleteIcon/>} onClick={() => props.setAddNew(false)}>
              Delete
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button variant='outlined' fullWidth color='primary' startIcon={<ArrowUpwardIcon/>} onClick={handleSubmit}>
              Submit
            </Button>
          </Grid>
        </Grid>
      </CardContent>
      <HandleAlert open={open} setOpen={setOpen} message='Print added to webstie.' severity='success' />
      <HandleAlert open={open} setOpen={setOpen} message='Print was not added to website.' severity='error' />
      <Loader loading={loading} />
    </>
  );
}
