import React from 'react';
import GoogleLogin from 'react-google-login';

import {clientIdGivenFromGoogle} from '../../credential';

export default function GoogleSignIn(props) {
  const handleSignIn = (response) => {
    console.log("You are now signed in");
    console.log(response);

    props.setSignedIn('google');
  }

  const handleFailureSignIn = (response) => {
    console.log("You have failed signing in with google");
    console.log(response);
  }

  // handle image change on hover
  let displayGoogleSignIn;
  if(props.isSignedIn === '') {
    displayGoogleSignIn = (
      <GoogleLogin
        clientId={clientIdGivenFromGoogle}
        buttonText='Sign in with Google'
        onSuccess={(response) => {handleSignIn(response)}}
        onFailure={(response) => {handleFailureSignIn(response)}}
        cookiePolicy={ 'single_host_origin' }
        responseType='code,token'
        isSignedIn={true}
      />
    )
  }else{
    displayGoogleSignIn = null;
  }

  return (
    <div>
      {displayGoogleSignIn}
    </div>
  );
}