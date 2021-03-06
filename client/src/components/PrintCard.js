import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import Magnifier from 'react-magnifier';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import HandleAlert from '../components/HandleAlert';
import PrintForm from '../components/PrintForm';
import RemovePrintModal from '../components/RemovePrintModal';
import { useStoreContext } from '../utils/GlobalState';
import { ADD_ITEM } from '../utils/actions';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
    marginLeft: 'auto',
    marginRight: 'auto',
    height: '100%'
  },
  media: {
    width: 256,
    height: 256,
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingTop: 0,
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
}));

export default function PrintCard(props) {
  const [state, dispatch] = useStoreContext();
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  const [focus, setFocus] = useState(false);
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [remove, setRemove] = useState(false);
  const [quantity, setQuantity] = useState(0);
  
  const handleExpandClick = () => {
    setExpanded(!expanded);
    setFocus(!focus);
  };

  const handleCartClick = () => {
    dispatch({
      type: ADD_ITEM,
      item: { id: props._id }
    });
    
    setOpen(true);
    setQuantity(quantity + 1);
  }

  const toggleRemove = () => {
    setRemove(!remove);
  }

  useEffect(() => {
    const item = state.cart.find(item => item.id === props._id);
    if (item) { setQuantity(item.quantity); }
  }, [props._id, state.cart])

  useEffect(() => {
    localStorage.setItem('bfg-cart', JSON.stringify([...state.cart]));
  }, [quantity, state.cart])

  return (
    <>
      <Card className={classes.root} raised>
        {edit
          ?
            <PrintForm
              exitForm={setEdit}
              name={props.name}
              series={props.series}
              description={props.description}
              price={props.price}
              quantity={props.quantity}
              image={props.image}
              featured={props.featured}
              about={props.about}
              _id={props._id}
              update={true}
            />
          :
            <>
              <CardHeader
                action={
                  state.isLoggedIn && state.isAdmin
                    ?
                      <>
                        <IconButton onClick={toggleRemove} aria-label='delete'>
                          <DeleteIcon />
                        </IconButton>
                        <IconButton onClick={() => setEdit(true)} aria-label='edit'>
                          <EditIcon />
                        </IconButton>
                      </>
                    :
                      <></>
                }
                title={props.name}
                subheader={props.series !== 'none' ? props.series + ' Series': 'Original Print'}
              />
              <CardMedia
                className={classes.media}
                title={props.name}
              >
                <Magnifier src={props.image} mgWidth={150} mgHeight={150} zoomFactor={3} />
              </CardMedia>
              <CardContent>
                <Typography variant='subtitle1' color='textPrimary' align='center'>
                  ${props.price.toFixed(2)}
                </Typography>
              </CardContent>
              <CardContent>
                <Typography variant='body2' color='textSecondary' component='p'>
                  {props.description !== 'none' ? props.description : 'No description provided.'}
                </Typography>
              </CardContent>
              <CardActions disableSpacing>
                <IconButton onClick={handleCartClick} disabled={quantity >= props.quantity} aria-label='add to shopping cart'>
                  <AddShoppingCartIcon />
                </IconButton>
                {window.location.pathname === '/home' && props.about
                  ?
                    <IconButton
                      className={clsx(classes.expand, {
                        [classes.expandOpen]: expanded,
                      })}
                      onClick={handleExpandClick}
                      aria-expanded={expanded}
                      aria-label='show more'
                    >
                      <ExpandMoreIcon />
                    </IconButton>
                  :
                    <></>
                }
              </CardActions>
              {props.about
                ?
                  <Collapse in={expanded} timeout='auto' unmountOnExit>
                    <CardContent>
                      <Typography paragraph>
                        {props.about}
                      </Typography>
                    </CardContent>
                  </Collapse>
                :
                  <></>
              }
            </>
        }
      </Card>
      <HandleAlert open={open} setOpen={setOpen} message='Added to cart.' severity='success' />
      {remove 
        ? 
          <RemovePrintModal remove={remove} setRemove={setRemove} _id={props._id} dispatch={dispatch}/>
        : 
          <></>
      }
    </>
  );
}
