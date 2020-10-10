import React, { useState, useEffect, useRef } from 'react';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import MenuList from '@material-ui/core/MenuList';
import { makeStyles } from '@material-ui/core/styles';
import SortIcon from '@material-ui/icons/Sort';
import SortByAlphaIcon from '@material-ui/icons/SortByAlpha';
import BurstModeIcon from '@material-ui/icons/BurstMode';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import { useStoreContext } from '../utils/GlobalState';
import { UPDATE_PRINTS } from '../utils/actions';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  paper: {
    marginRight: theme.spacing(2),
    border: 'none',
  },
  button: {
    margin: theme.spacing(0),
  },
  popper: {
    zIndex: theme.zIndex.speedDial,
  },
}));

export default function SortDropdown(props) {
  const classes = useStyles();
  const [state, dispatch] = useStoreContext();
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleSort = (sort) => {
    dispatch({
      type: UPDATE_PRINTS,
      prints: state.prints.sort((a, b) => (a[sort] > b[sort]) ? 1 : -1)
    });
  }

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <div className={classes.root}>
      <div>
        <Button className={classes.button}
          ref={anchorRef}
          aria-controls={open ? 'menu-list-grow' : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
          startIcon={<SortIcon />}
        >
          <Typography variant='inherit'>Sort</Typography>
        </Button>
        <Popper className={classes.popper} open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
            >
              <Paper className={classes.paper}>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                    <MenuItem onClick={(event) => { handleClose(event); handleSort('name') }}>
                      <ListItemIcon>
                        <SortByAlphaIcon fontSize='small' />
                      </ListItemIcon>
                      <Typography variant='inherit'>Name</Typography>
                    </MenuItem>
                    <MenuItem onClick={(event) => { handleClose(event); handleSort('series') }}>
                      <ListItemIcon>
                        <BurstModeIcon fontSize='small' />
                      </ListItemIcon>
                      <Typography variant='inherit'>Series</Typography>
                    </MenuItem>
                    <MenuItem onClick={(event) => { handleClose(event); handleSort('price') }}>
                      <ListItemIcon>
                        <AttachMoneyIcon fontSize='small' />
                      </ListItemIcon>
                      <Typography variant='inherit'>Price</Typography>
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    </div>
  );
}
