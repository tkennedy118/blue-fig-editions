import React, { useState } from 'react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Divider from '@material-ui/core/Divider';
import Slide from '@material-ui/core/Slide';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import HomeIcon from '@material-ui/icons/Home';
import Collection from '@material-ui/icons/Collections';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import CartIcon from '../components/CartIcon';
import { useStoreContext } from '../utils/GlobalState';
import { LOGOUT } from '../utils/actions';
import API from '../utils/API';

const drawerWidth = 256;

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  flex: {
    flex: 1
  },
  drawerPaper: {
    position: 'relative',
    width: drawerWidth
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  toolbarMargin: theme.mixins.toolbar,
  aboveDrawer: {
    zIndex: theme.zIndex.drawer + 1
  }
});

const MyToolbar = withStyles(styles)(
  ({ classes, title, onMenuClick, trigger }) => (
    <>
      <Slide timeout={256} direction='down' in={trigger}>
        <AppBar className={classes.aboveDrawer}>
          <Toolbar>
            <IconButton
              className={classes.menuButton}
              color='inherit'
              aria-label='menu'
              onClick={onMenuClick}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant='h6'
              color='inherit'
              className={classes.flex}
            >
              {title}
            </Typography>
            <IconButton
              color='inherit'
              aria-label='cart'
              component={Link}
              to='/cart'
            >
              <CartIcon isButton={true}/>
            </IconButton>
          </Toolbar>
        </AppBar>
      </Slide>
      <div className={classes.toolbarMargin} />
    </>
  )
);

const MyDrawer = withStyles(styles)(
  ({ classes, variant, open, onClose, onItemClick, isLoggedIn, handleSignOut, state }) => (
    <Drawer variant={variant} open={open} onClose={onClose}
      classes={{ paper: classes.drawerPaper }}
    >
      <div
        className={clsx({
          [classes.toolbarMargin]: variant === 'persistent'
        })}
      />
      <List>
        <ListItem button component={Link} to='/home' onClick={onItemClick('Home')}>
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText>Home</ListItemText>
        </ListItem>
        <ListItem button component={Link} to='/sale' onClick={onItemClick('Sale')}>
          <ListItemIcon>
            <Collection />
          </ListItemIcon>
          <ListItemText>Sale</ListItemText>
        </ListItem>
        <ListItem button component={Link} to='/cart' onClick={onItemClick('Checkout')}>
          <ListItemIcon>
            <CartIcon isButton={false}/>
          </ListItemIcon>
          <ListItemText>Checkout</ListItemText>
        </ListItem>
      </List>
      <Divider />
      {isLoggedIn
        ?
          <List>
            <ListItem button component={Link} to={`/profile/${state.user._id}`} onClick={onItemClick('Profile')}>
              <ListItemIcon>
                <AccountCircle />
              </ListItemIcon>
              <ListItemText>Profile</ListItemText>
            </ListItem>
            <ListItem button component={Link} to='/home' onClick={handleSignOut}>
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText>Sign Out</ListItemText>
            </ListItem>
          </List>
        :
          <List>
            <ListItem button component={Link} to='/signin' onClick={onItemClick('Signin')}>
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText>Sign In</ListItemText>
            </ListItem>
          </List>
      }
    </Drawer>
  )
);

function AppBarInteraction({ classes, variant }) {
  const [state, dispatch] = useStoreContext();
  const [drawer, setDrawer] = useState(false);
  const [title, setTitle] = useState('Home');

  // Deals with hiding app bar at specific breakpoints.
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('md'));
  const trigger = useScrollTrigger();

  const toggleDrawer = () => { setDrawer(!drawer); };

  const onItemClick = title => () => {
    setTitle(title);
    setDrawer(variant === 'temporary' ? false : drawer);
    setDrawer(!drawer);
  };

  const handleSignOut = async () => {
    await API.signout();
    dispatch({ type: LOGOUT });

    setTitle('Home');
    setDrawer(!drawer);
  }

  return (
    <div className={classes.root}>
      <MyToolbar title={title} onMenuClick={toggleDrawer} trigger={matches ? !trigger : true} />
      <MyDrawer
        open={drawer}
        onClose={toggleDrawer}
        onItemClick={onItemClick}
        handleSignOut={handleSignOut}
        variant={variant}
        isLoggedIn={state.isLoggedIn}
        state={state}
      />
    </div>
  );
}

export default withStyles(styles)(AppBarInteraction);
