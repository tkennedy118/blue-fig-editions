import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Nav from './components/Nav.js';
import Footer from './components/Footer.js';
import { StoreProvider } from './utils/GlobalState';

import Home from './pages/Home';
import Sale from './pages/Sale';
import Services from './pages/Services';
import Profile from './pages/Profile';
import Signin from './pages/Signin';
import './App.css';

function App() {
  return (
    <Paper square>
      <StoreProvider>
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
            </Switch>
          </>
        </Router>
      </StoreProvider>
    </Paper>
  );
}

export default App;
