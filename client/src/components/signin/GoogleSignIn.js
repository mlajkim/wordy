import React from 'react';
import GoogleLogin from 'react-google-login';

import {clientIdGivenFromGoogle} from '../../credential';


export default function GoogleSignIn(props) {
  const SIGNIN_TYPE = "google";
  let UNIQUE_ID = '';
  //
  //
  const handleSignIn = async (response) => {
    props.setDataLoading(true);
    props.setSignedIn('google');
    props.setModal('');

    // Step 1) Figure out if we have the user's data!
    let profile = response.profileObj;
    let res = await fetch(`/api/user/google/${profile.googleId}`, {
      method: 'GET',
      headers: {'Content-Type':'application/json'}
    })
    let resJson = await res.json();

    // Step 2) If it exists..
    if(resJson.status === 'success') {
      // if exists,
      // download the word data from the database!
      res = await fetch(`/api/word/${resJson.data._id}`, {
        method: 'GET',
        headers: {'Content-Type':'application/json'}
      })
      resJson = await res.json();
      if(resJson.status === 'success') props.setWords(resJson.data);

      // Set up the id as well
      UNIQUE_ID = resJson._id;

    }else{
      // This person is new user!
      if(props.page === 'welcome') props.setPage('introduce');
      // add that person into our database!
      res = await fetch('/api/user', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          typeOfLogIn: SIGNIN_TYPE,
          federalId: profile.googleId, 
          email: profile.email,
          familyName: profile.familyName,
          givenName: profile.givenName,
          profileImgUrl: profile.imageUrl,
          subscription: 'basic'
        })
      })

      // Set up the id as well
      UNIQUE_ID = res._id;
    }

    // Step 3) Finally set up the profile into React states
    props.setProfile({
      UNIQUE_ID: UNIQUE_ID,
      typeOfLogIn: SIGNIN_TYPE,
      federalId: profile.googleId, 
      email: profile.email,
      familyName: profile.familyName,
      givenName: profile.givenName,
      profileImgUrl: profile.imageUrl,
      subscription: profile.subscription
    });

    

    props.setDataLoading(false);
  }

  //
  //
  const handleFailureSignIn = (response) => {
    console.log("You have failed signing in with google");
    console.log(response);
  }

  // handle image change on hover
  //
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

  //
  //
  return (
    <div>
      {displayGoogleSignIn}
    </div>
  );
}