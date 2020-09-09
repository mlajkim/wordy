import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import CircularProgress from '@material-ui/core/CircularProgress';
import Avatar from '@material-ui/core/Avatar';

// Import components
import SignOut from '../components/signIn/GoogleSignOut';

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
  //
  const classes = useStyles();
  let profile = props.profile;


  // Navigation for page
  //
  const pages = ['welcome', 'introduce', 'list', 'review'];
  let showPages = pages.map(page => {
    return (
      <Button key={page} color="inherit" onClick={() => props.setPage(page)}>{page}</Button>
    )
  })


  // Loading animation
  //
  let displayLoadingAnimation = props.isDataLoading ? <LoadingAnimation /> : null;

  // Welcome user with the name if logged in
  //
  let welcomeIfLoggedIn;
  if(props.profile.givenName !== undefined) {
    welcomeIfLoggedIn = `Welcome, ${profile.givenName}`;
  }else {
    welcomeIfLoggedIn = null;
  }

  // SignIn Sing Out
  //
  let displaySignOutSection;
  if(props.isSignedIn !== '') {
    // if somehow signed in, show should logout 
    displaySignOutSection = (
      <SignOut setSignedIn={props.setSignedIn}/>
    );
  }else{
    // ELSE NO SHOW AT ALL
    displaySignOutSection = null;
  }

  // Render
  //
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
          {displayLoadingAnimation}
          {displaySignOutSection}
          {welcomeIfLoggedIn}
          <Avatar alt={`${profile.familyName} ${profile.givenName}`} src={profile.profileImgUrl} />
        </Toolbar>
      </AppBar>
    </div>
  );
}