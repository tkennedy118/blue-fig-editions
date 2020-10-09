import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Link from '@material-ui/core/Link';

function Copyright() {
  return (
    <Typography variant='body2' color='textSecondary'>
      {'Copyright © '}
      <Link color='inherit' href='/home'>
        bluefigeditions.com
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  footer: {
    padding: theme.spacing(3, 2),
    backgroundColor: theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
  },
}));

export default function StickyFooter() {
  const classes = useStyles();
  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.only('xs'));
  const pathname = window.location.pathname;
  const homes = ['/', '/home'];

  return (
    <div className={classes.root}>
      <footer className={classes.footer} style={{ marginBottom: (xs && homes.includes(pathname)) ? 56 : 0 }}>
        <Container maxWidth='sm'>
          <Typography variant='body1'>Keep local art alive in Nashville.</Typography>
          <Copyright />
        </Container>
      </footer>
    </div>
  );
}