import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  defaultHero: {
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(0),
  },
  paperHero: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(0),
  },
}))

export default function Hero(props) {
  const classes = useStyles();

  return (
    <div className={props.default ? classes.defaultHero : classes.paperHero} style={{ height: props.height }}>
      {props.children}
    </div>
  );
}
