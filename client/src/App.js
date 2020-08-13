import React from 'react';
import Paper from '@material-ui/core/Paper';
import Nav from './components/Nav.js';
import Footer from './components/Footer.js';
import { StoreProvider } from './utils/GlobalState';
import './App.css';

function App() {
  return (
    <Paper square>
      <StoreProvider>
        <Nav />
        <Footer />
      </StoreProvider>
    </Paper>
  );
}

export default App;
