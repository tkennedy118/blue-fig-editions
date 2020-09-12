import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

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
    <>
      <CssBaseline />
      <div 
        className={props.default ? classes.defaultHero : classes.paperHero} 
        style={{ height: props.fullHeight ? '100vh' : '100%' }}
      >
        {props.children}
      </div>
    </>
  );
}
