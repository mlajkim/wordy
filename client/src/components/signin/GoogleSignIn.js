import React from 'react';
import GoogleLogin from 'react-google-login';

import {clientIdGivenFromGoogle} from '../../credential';
import VERSION from '../../app/Version';


export default function GoogleSignIn(props) {
  const SIGNIN_TYPE = "google";
  let UNIQUE_ID = '';
  //
  //
  const handleSuccessfulSignIn = async (response) => {
    props.setDataLoading(true);
    props.setSignedIn('google');
    props.setModal('');
    props.setSnackbar({
      status: 'open',
      message: 'You have successfully signed in',
      severity: 'success'
    })

    // Step 1) Figure out if we have the user's data!
    //
    let userInfo;
    let profile = response.profileObj;
    
    const user = await fetch(`/api/mongo/user/google/${profile.googleId}`, {
      method: 'GET',
      headers: {'Content-Type':'application/json'}
    }).then(res => res.json());
    userInfo = user;

    // Step 2-1) If it exists..
    // (Handle the patch) 
    if(user.status === 'success') {
      // (Step 2-2) Set up the id for later usage
      //
      UNIQUE_ID = user.data._id;

      // Step 2-3) Compare the user-read-patch with the current version
      // if not staisfying, show the patch note
      // then save the data into the database
      if (parseFloat (user.data.readPatch) < parseFloat(VERSION.version)) {
      
        props.setModal({type: 'PatchNoteModal'});

        await fetch(`/api/mongo/user/${user.data._id}/one/readPatch`, {
          method: 'PUT',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({
            value: VERSION.version
          })
        });
      }


      // (Step 2-4) download the word data from the database!
      //
      const resWords = await fetch(`/api/mongo/word/${UNIQUE_ID}`, {
        method: 'GET',
        headers: {'Content-Type':'application/json'}
      }).then(res => res.json())
      if(resWords.status === 'success') props.setWords(resWords.data);

    }else{
      // (Step 3-1) This person is new user!
      // Just let them see the patch note
      // To prove that the web is constantly evolving
      props.setModal('PatchNoteModal');
      

      // add that person into our database! (Give the current version as well)
      const newUserRes = await fetch('/api/mongo/user', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          typeOfLogIn: SIGNIN_TYPE,
          federalId: profile.googleId, 
          email: profile.email,
          familyName: profile.familyName,
          givenName: profile.givenName,
          readPatch: VERSION.version,
          profileImgUrl: profile.imageUrl,
          subscription: ''
        })
      }).then(res => res.json())

      // Set up the id as well
      userInfo = newUserRes;
      UNIQUE_ID = newUserRes._id;
    }

    // Step 3) Finally set up the profile into React states
    props.setProfile({
      isSignedIn: true,
      UNIQUE_ID: UNIQUE_ID,
      typeOfLogIn: SIGNIN_TYPE,
      userInfo: userInfo.data
    });

    

    props.setDataLoading(false);
  }

  //
  //
  const handleFailureSignIn = (response) => {
    props.setModal('');
    console.log(response);
    props.setSnackbar({
      status: 'open',
      message: `Sign-in Fail: ${response.details}`,
      severity: 'error'
    })
  }

  // handle image change on hover
  //
  let displayGoogleSignIn;
  if(props.isSignedIn === '') {
    displayGoogleSignIn = (
      <GoogleLogin
        clientId={clientIdGivenFromGoogle}
        buttonText='Sign in with Google'
        onSuccess={(response) => {handleSuccessfulSignIn(response)}}
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