import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Sale from './pages/Sale';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Services from './pages/Services';
import './App.css';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path={'/sale'} component={Sale} />
        <Route exact path={'/profile'} component={Profile} />
        <Route exact path={'/services'} component={Services} />
        <Route exact path={['/', '/home']} component={Home} />
        <Route component={Home} />
      </Switch>
    </Router>
  );
}

export default App;
