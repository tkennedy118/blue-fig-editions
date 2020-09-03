import React, { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Nav from './components/Nav.js';
import Footer from './components/Footer.js';
import Loader from './components/Loader';
import { useStoreContext } from './utils/GlobalState';
import API from './utils/API';
import { LOGOUT, LOADING } from './utils/actions';

import Home from './pages/Home';
import Sale from './pages/Sale';
import Services from './pages/Services';
import Profile from './pages/Profile';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import './App.css';

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#ffffff',
      main: '#d7e5dc',
      dark: '#a6b3aa',
    },
    secondary: {
      light: '#524b46',
      main: '#29231f',
      dark: '#000000',
    },
    contrastThreshold: 3,
    tonalOffset: 0.2,
  },
})


function App() {
  const [state, dispatch] = useStoreContext();

  // Check if user is logged in.
  useEffect(() => {
    
    dispatch({ type: LOADING });
    async function fetchData() {
      let { data } = await API.status();
      console.log('DATA: ', data);
      
      if (data.status === false ) {
        dispatch({ type: LOGOUT });
      } else {
        dispatch({ type: LOGOUT });
      }
    }
    fetchData();

  }, []);

  return (
    <Paper square>
      <ThemeProvider theme={theme}>
        <Router>
          <>
            <Switch>
              <Route exact path={['/', '/home']} render={props => 
              <>
                <Nav />
                <Home />
                <Footer />
              </>
              }/>
              <Route exact path='/sale' render={props => 
              <>
                <Nav />
                <Sale />
                <Footer />
              </>
              }/>
              <Route exact path='/services' render={props => 
              <>
                <Nav />
                <Services />
                <Footer />
              </>
              }/>
              <Route exact path='/profile/:id' render={props => 
              <>
                <Nav />
                <Profile />
                <Footer />
              </>
              }/>
              <Route exact path='/signin' component={Signin} />
              <Route exact path='/signup' component={Signup} />
            </Switch>
          </>
        </Router>
        <Loader loading={state.loading} />
      </ThemeProvider>
    </Paper>
  );
}

export default App;
