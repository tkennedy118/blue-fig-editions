import React, { useState } from 'react';
import clsx from 'clsx';
import Image from 'material-ui-image';
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
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import { useStoreContext } from '../utils/GlobalState';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
    marginLeft: 'auto',
    marginRight: 'auto'
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
  const [state] = useStoreContext();
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  const [focus, setFocus] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
    setFocus(!focus);
  };

  return (
    <Card className={classes.root} raised>
      <CardHeader
        action={
          !state.isLoggedIn
            ?
              <IconButton aria-label='settings'>
                <MoreVertIcon />
              </IconButton>
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
        <Image src={require('../utils/images/' + props.image)} />
      </CardMedia>
      <CardContent>
        <Typography variant='subtitle1' color='textPrimary' align='center'>
          ${props.price}.00
        </Typography>
      </CardContent>
      <CardContent>
        <Typography variant='body2' color='textSecondary' component='p'>
          {props.description !== 'none' ? props.description : 'No description provided.'}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label='add to shopping cart'>
          <AddShoppingCartIcon />
        </IconButton>
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
      </CardActions>
      <Collapse in={expanded} timeout='auto' unmountOnExit>
        <CardContent>
          <Typography paragraph>About:</Typography>
          <Typography paragraph>
            Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, 
            looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum 
            passage, and going through the cites of the word in classical literature, 
            discovered the undoubtable source.
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}