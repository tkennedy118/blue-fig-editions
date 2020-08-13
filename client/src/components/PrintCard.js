import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
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
  }
}));

export default function RecipeReviewCard(props) {
  const [state] = useStoreContext();
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  const [focus, setFocus] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
    setFocus(!focus);
  };

  return (
    <Card className={classes.root}>
      <CardHeader
        action={
          state.isLoggedIn
            ?
              <IconButton aria-label='settings'>
                <MoreVertIcon />
              </IconButton>
            :
              <></>
        }
        title='Big Gilbert'
        subheader='Space-scape Series'
      />
      <CardMedia
        className={classes.media}
        image={require('../utils/images/Big-Gilbert.jpg')}
        title='Big Gilbert'
      />
      <CardContent>
        <Typography variant='body2' color='textSecondary' component='p'>
        Contrary to popular belief, Lorem Ipsum is not simply random text. 
        It has roots in a piece of classical Latin literature from 45 BC, making 
        it over 2000 years old.
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
          <Typography paragraph>Description:</Typography>
          <Typography paragraph>
            Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, 
            looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum 
            passage, and going through the cites of the word in classical literature, 
            discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 
            1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by 
            Cicero, written in 45 BC. This book is a treatise on the theory of ethics, 
            very popular during the Renaissance.
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}