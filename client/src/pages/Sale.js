import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import PrintCard from '../components/PrintCard';
import SortDropdown from '../components/SortDropdown';
import { useStoreContext } from '../utils/GlobalState';
import { LOADING, UPDATE_PRINTS } from '../utils/actions';
import API from '../utils/API';

const useStyles = makeStyles((theme) => ({
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  }
}));

function Sale() {
  const classes = useStyles();
  const [state, dispatch] = useStoreContext();
  const [sort, setSort] = useState(false);

  const getPrints = () => {
    dispatch({ type: LOADING });
    API.getPrints()
      .then(results => {
        dispatch({
          type: UPDATE_PRINTS,
          prints: results.data
        });
      })
      .catch(err => console.log(err));
  };

  const sortPrints = () => {
    dispatch({
      type: UPDATE_PRINTS,
      prints: state.prints.sort((a, b) => (a[sort] > b[sort]) ? 1 : -1)
    });
  };

  useEffect(() => {
    getPrints();
  }, []);

  useEffect(() => {
    sortPrints();
  }, [sort])

  return (
    <main>
      {/* <Hero /> */}
      <Container className={classes.cardGrid} maxWidth='md'>
        <Grid container spacing={3}>
          <SortDropdown setSort={setSort} />
        </Grid>
        <Grid container spacing={3}>
          {state.prints.map((print, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <PrintCard 
                name={print.name}
                description={print.description}
                series={print.series}
                price={print.price}
                count={print.count}
                image={print.image}
              />
            </Grid>
          ))}
        </Grid> 
      </Container>
    </main>
  );
}

export default Sale;
