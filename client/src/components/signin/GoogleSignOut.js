import React from 'react';

import {GoogleLogout} from 'react-google-login';

import {clientIdGivenFromGoogle} from '../../credential';

export default function SignOut(props) {

  // Signin Signout button 
  //
  const handleSignOut = () => {
    props.setSignedIn('');
    props.setProfile({});
    props.setWords([]);
  }

  //
  //
  const handleLogoutFailure = () => {

  }

  //
  //
  return (
    <div>
      <GoogleLogout
          clientId={clientIdGivenFromGoogle}
          buttonText='Sign out'
          onLogoutSuccess={() => {handleSignOut()}}
          onFailure={() => {handleLogoutFailure()}} />
    </div>
  );
}