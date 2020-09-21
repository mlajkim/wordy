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
  return (
    <div>
      <React.Fragment>
        <CssBaseline />
        <Container maxWidth="md">
          <Grid container direction="row">
            <SettingsIcon style={{ fontSize: 30, marginTop: 15, marginBottom: 25 }}/>
            <h3 style={{ marginTop: 15, marginBottom: 20 }}>Setting</h3>
          </Grid>
          <Grid container direction="row" style={{ marginBottom: 8}}>
            <Avatar
              style={{marginTop: 9}} 
              alt={`${props.profile.userInfo.familyName} ${props.profile.userInfo.givenName}`} 
              src={props.profile.userInfo.profileImgUrl}
            />
            <h4 style={{marginRight: 8, marginLeft: 15}}>
              {props.profile.userInfo.givenName} {props.profile.userInfo.familyName}
            </h4>
            <p style={{marginTop: 19}}>(Syncing to {props.profile.userInfo.email})</p>
          </Grid>
          <GoogleSignOut 
              isSignedIn={props.isSignedIn}
              setSignedIn={props.setSignedIn}
              profile={props.profile}
              setPage={props.setPage}
              setProfile={props.setProfile}
              setWords={props.setWords}
              setSnackbar={props.setSnackbar}/>
          <Grid container direction="row">
            <FavoriteOutlinedIcon style={{ fontSize: 25, marginTop: 20, marginBottom: 25 }}/>
            <h4 style={{ marginTop: 22, marginBottom: 10, marginRight: 7 }}> Subscription Status: </h4>
            {props.profile.userInfo.subscription === 'Pro' && 
            <WhatshotIcon style={{ fontSize: 30, marginTop: 15, marginBottom: 25, color: 'Red' }} />}
            <h3 style={{ marginTop: 20, marginBottom: 25 }}>{props.profile.userInfo.subscription} Member</h3>
          </Grid>
          <Grid container direction="row">
            <Button variant="outlined" color="secondary" 
                    style={{ marginRight: 20}}
                    onClick={() => props.setModal({type: 'PauseResumeModal'})}>
              PAUSE MEMBERSHIP
            </Button>
            <Button variant="outlined" color="secondary" 
                    onClick={() => {props.setModal({type: 'DeleteAccountModal'})}}>
              DELETE ACCOUNT
            </Button>
          </Grid>
        </Container>
      </React.Fragment>
    </div>
  );
}