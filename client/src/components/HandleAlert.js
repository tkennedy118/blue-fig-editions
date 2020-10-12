import React from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    success: {
      light: '#64b5f6',
      main: '#2196f3',
      dark: '#1976d2',
    },
  },  
}); 

function Alert(props) {
  return <MuiAlert elevation={6} variant='filled' {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
  snackbar: {
    marginTop: theme.spacing(2),
  },
}));

export default function HandleAlert(props) {
  const classes = useStyles();

  const handleClose = (reason) => {
    if (reason === 'clickaway') {
      return;
    }

    props.setOpen(false);
  };

  return (
    <div className={classes.root}>
      <ThemeProvider theme={theme}>
        <Snackbar 
          open={props.open} 
          autoHideDuration={2000} 
          onClose={() => props.setOpen(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          className={classes.snackbar}
        >
          <Alert onClose={handleClose} severity={props.severity}>
            {props.message}
          </Alert>
        </Snackbar>
      </ThemeProvider>
    </div>
  );
}
