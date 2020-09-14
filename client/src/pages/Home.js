import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import ScrollableAnchor, { configureAnchors, goToTop } from 'react-scrollable-anchor';
import VisibilitySensor from 'react-visibility-sensor';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Fade from '@material-ui/core/Fade';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import FiberNewIcon from '@material-ui/icons/FiberNew';
import InfoIcon from '@material-ui/icons/Info';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import ContactMailIcon from '@material-ui/icons/ContactMail';
import Hero from '../components/Hero';
import Loader from '../components/Loader';
import PrintCard from '../components/PrintCard';
import ClassesCard from '../components/ClassesCard';
import ContactForm from '../components/ContactForm';
import { useStoreContext } from '../utils/GlobalState';
import { LOADING, UPDATE_FEATURED_PRINTS } from '../utils/actions';
import { lessons } from '../utils/lessons';
import API from '../utils/API';
import Nekko from '../utils/images/nekko.png';
import Martino from '../utils/images/martino.png';

const useStyles = makeStyles((theme) => ({
  artistImg: {
    width: '100%',
    background: theme.palette.background.default,
    backgroundColor: theme.palette.background.default,
    borderRadius: '50%',
    [theme.breakpoints.down('sm')]: {
      width: 256,
    },
  },
  heroBackground: {
    height: '100%',
    position: 'relative',
    '&:before': {
      content: '" "',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      opacity: 1,
      transition: 'opacity 1.25s',
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
  classesBackground: {
    height: '100%',
    position: 'relative',
    '&:before': {
      content: '" "',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      transition: 'opacity 1.25s',
      opacity: 1,
      backgroundSize: 'cover',
      [theme.breakpoints.down('sm')]: {
        backgroundPosition: 'center',
      },
      backgroundRepeat: 'no-repeat',
      backgroundImage: `url(${Nekko})`, 
      transform: 'scaleX(-1) scaleY(-1)',
    },
  },
  backgroundFade: {
    '&:before': {
      opacity: 0.15,
    },
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  verticalAlign: {
    margin: 0,
    position: 'absolute',
    top: '45%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  title: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(4),
  },
  section: {
    padding: theme.spacing(8, 0, 8),
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nav: {
    position: 'fixed',
    top: 28,
    zIndex: theme.zIndex.drawer + 1,
  },
  navItem: {
    maringLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
  },
  navBottom: {
    position: 'fixed',
    bottom: 0,
    width: '100vw',
    borderTop: `2px solid ${theme.palette.primary.main}`,
  },
  toTopButton: {
    position: 'absolute',
    bottom: theme.spacing(1),
  },
}));

function Home() {
  const classes = useStyles();
  const [state, dispatch] = useStoreContext();
  const [subject, setSubject] = useState('');
  const [visible, setVisible] = useState({
    top: false,
    classes: false
  });
  const location_search = 'The+Arcade+Nashville&2C65+Arcade+Alley%2C+Nashville%2C+TN+37219';
  const location_id = 'ChIJiccAvouiZIgRj0P8XT2smLg';

  // Deals with hiding app bar at specific breakpoints.
  const theme = useTheme();
  const smallToMedium = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const extraSmall = useMediaQuery(theme.breakpoints.only('xs'));
  const trigger = useScrollTrigger();

  // Deals with bottom navigation
  const [value, setValue] = React.useState('recents');

  // Scrollable anchor configuration.
  configureAnchors({offset: -88, scrollDuration: 512})

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const onChange = (isVisible) => {
    console.log('HANDLE TOP');
    console.log('IS VISIBLE: ', isVisible);
    console.log('VISIBLE: ', visible);
    setVisible({ ...visible, classes: isVisible });
  };

  const handleVisChange = (isVisible) => {
    console.log('HANDLE CLASSES');
    console.log('IS VISIBLE: ', isVisible);
    console.log('VISIBLE: ', visible);
    setVisible({ ...visible, classes: isVisible });
  };

  const getPrints = () => {
    dispatch({ type: LOADING });
    API.getPrints()
      .then(results => {
        const featured = results.data.filter(print => print.featured === true);
        dispatch({
          type: UPDATE_FEATURED_PRINTS,
          prints: featured
        });
      })
      .catch(err => console.log(err));
  };

  useEffect(() => {
    getPrints();
  }, []);

  function getTop() {
    return(
      <VisibilitySensor partialVisibility={true}>
        {({ isVisible }) =>
          <div style={{ minHeight: '100vh' }} className={isVisible ? `${classes.heroBackground} ${classes.backgroundFade}` : classes.heroBackground}>
            <Container maxWidth='sm' className={classes.verticalAlign} style={{ zIndex: 1 }}>
              <Typography component='h1' variant='h2' align='center' color='textPrimary' className={classes.title} gutterBottom>
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
                    <Button component='a' href='#featured' variant='contained' color='secondary'>
                      More
                    </Button>
                  </Grid>
                </Grid>
              </div>
            </Container>
          </div>
        }
      </VisibilitySensor>
    );
  }

  function getSectionClasses() {
    return(
        <VisibilitySensor partialVisibility={true}>
          {({ isVisible }) =>
            <div className={isVisible ? `${classes.classesBackground} ${classes.backgroundFade}` : classes.classesBackground}>
              <Hero default={false}>
                <div className={classes.section}>
                  <Container>
                    <ScrollableAnchor id={'classes'}>
                      <Typography component='h2' variant='h3' align='center' color='textPrimary' className={classes.title} gutterBottom>
                        Classes
                      </Typography>
                    </ScrollableAnchor>
                    <Grid container spacing={3} justify='center' align='center'>
                      {lessons.length > 0
                        ?
                          <>
                            {lessons.map((item, index) => (
                              <Grid item key={index} xs={12} md={4}>
                                <ClassesCard
                                  name={item.name}
                                  lineOne={item.lineOne}
                                  lineTwo={item.lineTwo}
                                  setSubject={setSubject}
                                />
                              </Grid>
                            ))}
                          </>
                        :
                          <Grid item xs={12}>
                            <Typography variant='body1' align='center' style={{ fontStyle: 'italic' }} paragraph>
                              There are no classes offered at this time.
                            </Typography>
                          </Grid>
                      }
                    </Grid>
                  </Container>
                </div>
              </Hero>
            </div>
          }
        </VisibilitySensor>
    );
  }

  return (
    <>
      {extraSmall
        ?
          <></>
        :
          <Fade timeout={256} in={smallToMedium ? !trigger : true}>
            <Grid container maxWidth='sm' justify='center' style={{ marginLeft: 24 }}>
              <div className={classes.nav}>
                <Grid item>
                  <Link href='#featured' underline='none'>
                    <Typography className={classes.navItem} variant='text2' color='textSecondary'>
                      featured
                    </Typography>
                  </Link>
                  <Link href='#about' underline='none'>
                    <Typography className={classes.navItem} variant='text2' color='textSecondary'>
                      about
                    </Typography>
                  </Link>
                  <Link href='#classes' underline='none'>
                    <Typography className={classes.navItem} variant='text2' color='textSecondary'>
                      classes
                    </Typography>
                  </Link>
                  <Link href='#contact' underline='none'>
                    <Typography className={classes.navItem} variant='text2' color='textSecondary'>
                      contact
                    </Typography>
                  </Link>
                </Grid>
              </div>
            </Grid>
          </Fade>
      }
      <Hero default={true} fullHeight={true}>
      {getTop()}
      </Hero>
      <div style={{ minHeight: '100vh' }}>
        <Hero default={false}>
          <div className={classes.section}>
            <Container>
              <ScrollableAnchor id={'featured'}>
                <Typography component='h2' variant='h3' align='center' color='textPrimary' className={classes.title} gutterBottom>
                  Featured
                </Typography>
              </ScrollableAnchor>
              <Grid container spacing={2} justify='center'>
                {state.featured.length > 0
                  ?
                    <>
                      {state.featured.map((print, index) => (
                        <Grid item key={index} xs={12} sm={6} md={4}>
                          <PrintCard 
                            name={print.name}
                            description={print.description}
                            series={print.series}
                            price={print.price}
                            count={print.count}
                            image={print.image}
                            featured={print.featured}
                            about={print.about}
                            _id={print._id}
                          />
                        </Grid>
                      ))}
                    </>
                  :
                    <Grid item xs={12}>
                      <Typography variant='body1' align='center' style={{ fontStyle: 'italic' }} paragraph>
                        There are no featured prints at this time.
                      </Typography>
                    </Grid>
                }
              </Grid>
            </Container>
          </div>
        </Hero>
      </div>
      <Hero default={true} fullHeight={true}>
        <div className={classes.section}>
          <Container>
            <ScrollableAnchor id={'about'}>
              <Typography component='h2' variant='h3' align='center' color='textPrimary' className={classes.title} gutterBottom>
                The Artist
              </Typography>
            </ScrollableAnchor>
            <Grid container spacing={3} justify='center' alignItems='center'>
              <Grid item xs={12} md={5} align='center'>
                <img
                  src={Martino}
                  alt='Mike Martino'
                  className={classes.artistImg}
                />
              </Grid>
              <Grid item xs={12} md={5}>
                <Typography component='h3' variant='h4' align='center' color='textSecondary' gutterBottom>
                  Mike Martino
                </Typography>
                <Typography variant='body1' align='left' color='textSecondary' paragraph>
                  Mike Martino is an acclaimed artist and printmaker, showing his work both locally 
                  throughout the Nashville area as well as maintaining connections throughout the United States.
                </Typography>
              </Grid>
            </Grid>
          </Container>
        </div>
      </Hero>
      {getSectionClasses()}
      <Hero default={true} fullHeight={true}>
        <div className={classes.section} style={{ position: 'relative' }}>
          <Grid container justify='center' alignItems='center'>
            <Grid item xs={12} sm={8} md={6} lg={4}>
              <ScrollableAnchor id={'contact'}>
                <Typography component='h2' variant='h3' align='center' color='textPrimary' className={classes.title} gutterBottom>
                  Contact
                </Typography>
              </ScrollableAnchor>
              <ContactForm 
                subject={subject.length > 1 ? `${subject} Lessons` : ''} 
                message={subject.length > 1 ? `I would like to know more about ${subject} classes. Please contact me at the provided email with more information. Thank you.` : ''}
              />
            </Grid>
            <Grid item xs={12} align='center' className={classes.toTopButton}>
              <Button variant='text' color='secondary' onClick={goToTop}>
                Back to Top
              </Button>
            </Grid>
          </Grid>
        </div>
      </Hero>
      {extraSmall
        ?
        <BottomNavigation value={value} onChange={handleChange} className={classes.navBottom}>
          <BottomNavigationAction component='a' href='#featured' label='Featured' value='featured' icon={<FiberNewIcon />} />
          <BottomNavigationAction component='a' href='#about' label='About' value='about' icon={<InfoIcon />} />
          <BottomNavigationAction component='a' href='#classes' label='Classes' value='classes' icon={<LocalOfferIcon />} />
          <BottomNavigationAction component='a' href='#contact' label='Contact' value='contact' icon={<ContactMailIcon />} />
        </BottomNavigation>
        :
          <></>
      }
      <Loader loading={state.loading} />
    </>
  );
}

export default Home;
