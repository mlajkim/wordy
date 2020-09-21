// mains
import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button'
// icon
import SettingsIcon from '@material-ui/icons/Settings';
import FavoriteOutlinedIcon from '@material-ui/icons/FavoriteOutlined';
import WhatshotIcon from '@material-ui/icons/Whatshot';

// components
import GoogleSignOut from'../../components/sign_in/GoogleSignOut';


export default function Setting(props) {

  // handle subscription 
  let renderSubscription;
  if(props.profile.userInfo.subscription === 'Pro') {
    renderSubscription = (
      <Grid container direction="row">
        <WhatshotIcon style={{ fontSize: 30, marginTop: 15, marginBottom: 25 }}/>
        <h3 style={{ marginTop: 15, marginBottom: 25 }}>Pro Member</h3>
      </Grid>
    )
  }else {
    renderSubscription = <h5 style={{ marginTop: 18, marginBottom: 25 }}>Basic Member</h5>
  }

  return (
    <div>
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="md">
      <Grid container direction="row">
        <SettingsIcon style={{ fontSize: 30, marginTop: 15, marginBottom: 25 }}/>
        <h3 style={{ marginTop: 15, marginBottom: 25 }}>Setting</h3>
      </Grid>
      <Grid container direction="row">
        <Avatar alt={`${props.profile.userInfo.familyName} ${props.profile.userInfo.givenName}`} 
                src={props.profile.userInfo.profileImgUrl}/>
        <Grid container direction="column">
          <h4>{props.profile.userInfo.givenName} {props.profile.userInfo.familyName}</h4>
          <p>Syncing to {props.profile.userInfo.email}</p>
        </Grid>
          <GoogleSignOut 
                isSignedIn={props.isSignedIn}
                setSignedIn={props.setSignedIn}
                profile={props.profile}
                setPage={props.setPage}
                setProfile={props.setProfile}
                setWords={props.setWords}
                setSnackbar={props.setSnackbar}/>
        </Grid>

      <Grid container direction="row">
        <FavoriteOutlinedIcon style={{ fontSize: 30, marginTop: 15, marginBottom: 25 }}/>
        <h5 style={{ marginTop: 18, marginBottom: 10, marginRight: 10 }}>Subscription Status: </h5>
        {renderSubscription}
      </Grid>
      
      <Button variant="outlined" color="primary">Show transaction</Button>
      <br />
      <Button variant="outlined" color="secondary" 
              onClick={() => props.setModal({type: 'PauseResumeModal'})}>
        Pause / Resume Membership
      </Button>
      <br /><br /><br />
      <Button variant="outlined" color="secondary" 
              onClick={() => {props.setModal({type: 'DeleteAccountModal'})}}>
        Delete This Account!
      </Button>
      </Container>
    </React.Fragment>

    </div>
  );
}