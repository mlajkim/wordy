import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import CircularProgress from '@material-ui/core/CircularProgress';

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

const loadingStyle = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > * + *': {
      marginLeft: theme.spacing(2),
    },
  },
}));

function LoadingAnimation() {
  const classes = loadingStyle();

  return (
    <div className={classes.root}>
      <CircularProgress />
      <CircularProgress color="inherit" />
    </div>
  );
}


export default function Appbar(props) {
  // Styles
  const classes = useStyles();

  // Navigation for page
  const pages = ['welcome', 'introduce', 'list', 'review'];
  let showPages = pages.map(page => {
    return (
      <Button color="inherit" onClick={() => props.setPage(page)}>{page}</Button>
    )
  })

  // Loading animation
  let displayLoadingAnimation = props.isDataLoading ? <LoadingAnimation /> : null;
  let displayLoginSeciton;
  if(!props.userId) displayLoginSeciton = (
    <div>
      <Button color="inherit" onClick={() => props.setPopup('login')}>login</Button>
    </div>
  )
  else displayLoginSeciton = (
    <>
      {displayLoadingAnimation} 
      Welcome, {props.userId}
      <Button color="inherit" onClick={() => handleLogout()}>logout</Button>
    </>
  )

  // Signin Signout button 
  const handleLogout = () => {
    props.setPopup('');
    props.setUserId('');
    props.setWords([]);
  }

  /// Render
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
          {showPages}
          {displayLoginSeciton}
        </Toolbar>
      </AppBar>
    </div>
  );
}