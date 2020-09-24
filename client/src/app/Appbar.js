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

import VERSION from './Version';


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
      <CircularProgress color="inherit" />
    </div>
  );
}


export default function Appbar(props) {
  // Styles
  //
  const classes = useStyles();

  // Display Subscription Type
  let subscription;
  if(props.profile.isSignedIn) subscription = props.profile.userInfo.subscription;
  else subscription = null;

  // Loading animation
  //
  let displayLoadingAnimation = props.isDataLoading ? <LoadingAnimation /> : null;


  // Admin Page
  let showAdminPageButton;
  if(props.profile.isSignedIn && props.profile.userInfo.status === 'admin') {
    showAdminPageButton = (
      <Button variant="contained" color="primary" onClick={() => props.setPage('admin')}>
        Admin
      </Button>
    )
  } else {
    showAdminPageButton = null;
  }

  // Pro Subscription
  let promoteProSubscription;
  if(props.profile.isSignedIn && props.profile.userInfo.subscription !== 'Pro') {
    promoteProSubscription = (
      <Button variant="contained" color="primary" onClick={() => props.setModal({type: 'PromoteModal'})}>
        UPGRADE TO PRO
      </Button>
    )
  } else {
    promoteProSubscription = null;
  }
  

  // Sign in or the image
  let showSignIn;
  if(props.profile.isSignedIn) {
    // if already signed in
    showSignIn = <Avatar alt={`${props.profile.userInfo.familyName} ${props.profile.userInfo.givenName}`} 
                  src={props.profile.userInfo.profileImgUrl}
                  onClick={() => {props.setPage('setting')}}/>;
                  
  } else if (props.isDataLoading) {
    // if one is not signed in yet, but the loading animation is on going ,
    // it means that it is working on signing in process 
    // therefore can make it null with confidence.
    showSignIn = null;

  } else {
    // not signed in
    showSignIn = <Button color="inherit" onClick={() => props.setModal({type: 'SignInModal'})}>Sign in</Button>
  }

  // Render
  //
  const appbarColor = props.isSandbox ? 'transparent' : 'primary';
  const appTitle = props.isSandbox ? 'Sandy' : 'Wordy';
  return (
    <div className={classes.root}>
      <AppBar position="static" color={appbarColor}>
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" 
                      aria-label="menu" onClick={() => {props.setPage('')}}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            {appTitle} {subscription} {VERSION.version}
          </Typography>
          {displayLoadingAnimation}
          {showAdminPageButton}
          {promoteProSubscription}
          {showSignIn}
        </Toolbar>
      </AppBar>
    </div>
  );
}