import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function Appbar(props) {
  const classes = useStyles();

  // Handles the top right side of appbar
  const handleLogout = () => {
    props.setPopup('');
    props.setUserId('');
  }

  let displayLoginSeciton;
  if(!props.userId) displayLoginSeciton = (
    <div>
      <Button color="inherit" onClick={() => props.setPopup('login')}>login</Button>
    </div>
  )
  else displayLoginSeciton = (
    <>
      Welcome, {props.userId}
      <Button color="inherit" onClick={() => handleLogout()}>logout</Button>
    </>
  )
  
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Wordy Project
          </Typography>
          {displayLoginSeciton}
        </Toolbar>
      </AppBar>
    </div>
  );
}