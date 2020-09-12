import React from 'react';

import {GoogleLogout} from 'react-google-login';

import {clientIdGivenFromGoogle} from '../../credential';

export default function GoogleSignOut(props) {

  // Signin Signout button 
  //
  const handleSuccessfulSignOut = () => {
    props.setPage('welcome');
    props.setSignedIn('');
    props.setProfile({isSignedIn: false});
    props.setWords([]);
    props.setSnackbar({
      status: 'open',
      severity: 'info',
      message: 'You have been successfully signed out'
    })
  }

  //
  //
  const handleLogoutFailure = (res) => {
    props.setSnackbar({
      status: 'open',
      severity: 'error',
      message: `Fail: ${res}`
    })
  }

  //
  //
  return (
    <div>
      <GoogleLogout
          clientId={clientIdGivenFromGoogle}
          buttonText='Sign out safely with Google'
          onLogoutSuccess={() => {handleSuccessfulSignOut()}}
          onFailure={(res) => {handleLogoutFailure(res)}} />
    </div>
  );
}