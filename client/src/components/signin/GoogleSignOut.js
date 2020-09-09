import React from 'react';

import {GoogleLogout} from 'react-google-login';

import {clientIdGivenFromGoogle} from '../../credential';

export default function SignOut(props) {

  // Signin Signout button 
  //
  const handleSignOut = () => {
    props.setPage('welcome');
    props.setSignedIn('');
    props.setProfile({});
    props.setWords([]);
  }

  //
  //
  const handleLogoutFailure = () => {

  }

  // handle the body
  // 
  let body;
  if(props.isSignedIn !== '') {
    body = (<GoogleLogout
      clientId={clientIdGivenFromGoogle}
      buttonText='Sign out safely with Google'
      onLogoutSuccess={() => {handleSignOut()}}
      onFailure={() => {handleLogoutFailure()}} />);
  }else{
    body = null;
  }

  //
  //
  return (
    <div>
      {body}
    </div>
  );
}