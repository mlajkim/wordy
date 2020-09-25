// eslint-disable-next-line
import React from 'react';
import {GoogleLogout} from 'react-google-login';
 // Credential
import {GOOGLE_CLIENT_ID} from '../../credential';
// APIs & Model
import {Props} from '../../model';

const GoogleSignOut = (props: Props) => {
  // Signin Signout button 
  //
  const handleSuccessfulSignOut = () => {
    props.setPage('welcome');
    props.setProfile({isSignedIn: false});
    props.setWords([]);
    props.setSnackbar({
      status: 'open',
      severity: 'info',
      message: 'You have been successfully signed out'
    })
  }

  const handleLogoutFailure = () => {
    props.setSnackbar({
      status: 'open',
      severity: 'error',
      message: `Log out failed`
    })
  }

  return (
    <div>
      <GoogleLogout
        clientId={GOOGLE_CLIENT_ID}
        buttonText='Sign out safely with Google'
        onLogoutSuccess={() => {handleSuccessfulSignOut()}}
        onFailure={() => {handleLogoutFailure()}} 
      />
    </div>
  );
}

export default GoogleSignOut