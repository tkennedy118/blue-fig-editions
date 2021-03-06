import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import Fade from '@material-ui/core/Fade';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { makeStyles } from '@material-ui/core/styles';
import PrintCard from '../components/PrintCard';
import PrintForm from '../components/PrintForm';
import SortDropdown from '../components/SortDropdown';
import { useStoreContext } from '../utils/GlobalState';
import { LOADING, UPDATE_PRINTS } from '../utils/actions';
import API from '../utils/API';

const useStyles = makeStyles((theme) => ({
  cardGrid: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    minHeight: '100vh',
  },
  addNewCard: {
    maxWidth: 345,
    height: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
    position: 'relative',
  },
  addNewCardBtn: {
    position: 'absolute',
    margin: 0,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
}));

function Sale() {
  const classes = useStyles();
  const [state, dispatch] = useStoreContext();
  const [addNew, setAddNew] = useState(false);

  useEffect(() => {
    dispatch({ type: LOADING });
    API.getPrints()
      .then(results => {
        dispatch({
          type: UPDATE_PRINTS,
          prints: results.data
        });
      })
      .catch(err => console.log(err));
  }, [dispatch]);

  return (
    <>
      <main>
        <Container className={classes.cardGrid} maxWidth='md'>
          <Grid container spacing={2}>
            <Grid item xs={12} >
              <SortDropdown />
            </Grid>
            <Grid item xs={12} style={{ marginBottom: 8 }}>
              <Divider />
            </Grid>
            {state.isLoggedIn && state.isAdmin
              ?
                <Grid item xs={12} sm={6} md={4}>
                  <Card className={classes.addNewCard} raised>
                      {addNew
                        ?
                          <PrintForm exitForm={setAddNew}/>
                        :
                          <CardContent className={classes.addNewCardBtn}>
                            <IconButton onClick={() => setAddNew(true)}>
                              <AddCircleIcon style={{ fontSize: 128 }}/>
                            </IconButton>
                          </CardContent>
                      }
                  </Card>
                </Grid>
              :
                <></>
            }
            {state.prints.map((print, index) => (
              <Fade in={true} timeout={1700}>
                <Grid item key={index} xs={12} sm={6} md={4}>
                  <PrintCard 
                    name={print.name}
                    description={print.description}
                    series={print.series}
                    price={print.price}
                    quantity={print.quantity}
                    image={print.image}
                    featured={print.featured}
                    about={print.about}
                    _id={print._id}
                  />
                </Grid>
              </Fade>
            ))}
          </Grid> 
        </Container>
      </main>
    </>
  );
}

export default Sale;
