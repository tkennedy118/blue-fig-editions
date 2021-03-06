import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  root: {
    border: `2px solid ${theme.palette.primary.main}`,
    height: '100%',
    maxWidth: 345,
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
}));

export default function OutlinedCard(props) {
  const classes = useStyles();

  const handleClick = (event) => {
    event.preventDefault();
    props.setSubject(props.name);
    props.executeScroll(props.contactRef);
  };

  return (
    <Card className={classes.root} align='left' raised>
      <CardContent style={{ minHeight: 256 }}>
        <Typography variant='h5' color='textSecondary' align='center' paragraph>
          {props.name}
        </Typography>
        <Typography variant='body2' color='textSecondary' paragraph>
          {props.lineOne}
        </Typography>
        <Typography variant='body2' color='textSecondary' paragraph>
          {props.lineTwo}
        </Typography>
      </CardContent>
      <CardActions style={{ justifyContent: 'center' }}>
        <Button color='secondary' variant='outlined' onClick={handleClick}>Add Class</Button>
      </CardActions>
    </Card>
  );
}