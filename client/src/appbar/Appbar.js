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

import VERSION from '../app/Version';


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

  // Display Subscription Type
  let subscription;
  if(props.profile.isSignedIn) subscription = props.profile.userInfo.subscription;
  else subscription = null;

  // Loading animation
  //
  let displayLoadingAnimation = props.isDataLoading ? <LoadingAnimation /> : null;

  // Pro Subscription
  let promoteProSubscription;
  if(props.profile.isSignedIn) {
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
  } else {
    // not signed in
    showSignIn = <Button color="inherit" onClick={() => props.setModal({type: 'SignInModal'})}>Sign in</Button>
  }

  // Render
  //
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" 
                      aria-label="menu" onClick={() => {props.setPage('')}}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Wordy {subscription} {VERSION.version}
          </Typography>
          {displayLoadingAnimation}
          {promoteProSubscription}
          {showSignIn}
        </Toolbar>
      </AppBar>
    </div>
  );
}