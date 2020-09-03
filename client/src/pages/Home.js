import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Hero from '../components/Hero';
import Loader from '../components/Loader';
import Nekko from '../utils/images/nekko.png';

const useStyles = makeStyles((theme) => ({
  heroContent: {
    height: '100%',
    position: 'relative',
    '&:before': {
      content: '" "',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      opacity: 0.25,
      backgroundSize: 'cover',
      backgroundColor: theme.palette.background.default,
      backgroundPosition: 'left',
      [theme.breakpoints.down('sm')]: {
        backgroundPosition: 'center',
      },
      backgroundRepeat: 'no-repeat',
      backgroundImage: `url(${Nekko})`,
    },
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  verticalAlign: {
    margin: 0,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
}));

function Home() {
  const classes = useStyles();
  const [loading, setLoading ] = useState(false);
  const location_search = 'The+Arcade+Nashville&2C65+Arcade+Alley%2C+Nashville%2C+TN+37219';
  const location_id = 'ChIJiccAvouiZIgRj0P8XT2smLg';

  return (
    <>
      <Hero default={true} height='100vh'>
        <div className={classes.heroContent}>
          <Container maxWidth='sm' className={classes.verticalAlign}>
            <Typography component='h1' variant='h2' align='center' color='textPrimary' gutterBottom>
              Blue Fig Editions
            </Typography>
            <Typography variant='body1' align='center'>
              <span>Located at&nbsp;</span>
              <Link 
                href={`https://www.google.com/maps/search/?api=1&query=${location_search}&query_place_id=${location_id}`} 
                target='_blank' 
                rel='noreferrer'
                color='inherit'
                underline='hover'
              >
                The Arcade Nashville
              </Link>
            </Typography>
            <Typography variant='body1' align='center' paragraph>
              Room 56
            </Typography>
            <Typography variant='body1' align='center' paragraph>
              Blue Fig is an established printmaking workshop that
              collaborates with artists to produce limited editions of original silk screens, etchings,
              lithographs, woodcuts, monotypes, and collographs.
            </Typography>
            <div className={classes.heroButtons}>
              <Grid container spacing={2} justify='center'>
                <Grid item>
                  <Button component={RouterLink} to='/sale' variant='outlined' color='secondary'>
                    For Sale
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant='contained' color='secondary'>
                    More
                  </Button>
                </Grid>
              </Grid>
            </div>
          </Container>
        </div>
      </Hero>
      <Loader loading={loading} />
    </>
  );
}

export default Home;
