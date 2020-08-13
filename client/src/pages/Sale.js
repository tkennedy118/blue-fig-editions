import React from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import PrintCard from '../components/PrintCard';

const useStyles = makeStyles((theme) => ({
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  }
}));

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];

function Sale() {
  const classes = useStyles();

  return (
    <main>
      {/* <Hero /> */}
      <Container className={classes.cardGrid} maxWidth='md'>
        <Grid container spacing={3}>
          {cards.map((card) => (
            <Grid item key={card} xs={12} sm={6} md={4}>
              <PrintCard />
            </Grid>
          ))}
        </Grid> 
      </Container>
    </main>
  );
}

export default Sale;
