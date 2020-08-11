import React from 'react';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Nav from './components/Nav.js';
import Footer from './components/Footer.js';
import './App.css';

function App() {
  return (
    <Container>
      <Paper square>
        <Nav />
        <Footer />
      </Paper>
    </Container>
  );
}

export default App;
