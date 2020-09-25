// eslint-disable-next-line
import React from 'react';
import GoogleLogin from 'react-google-login';
// Credential
import {GOOGLE_CLIENT_ID} from '../../credential';
// APIs & Model
import {handle_existing_user, handle_new_user, handle_signin_error} from './GoogleSingnInAPI';
import {Props} from '../../model';

const GoogleSignIn = (props: Props) => {
  const handleSuccessfulSignIn = async (googleResponse: any) => {
    // Initiate
    props.setDataLoading(true);
    props.setModal('');
    props.setSnackbar({
      status: 'open',
      message: 'You have successfully signed in',
      severity: 'success',
      closeInSec: 1
    })

    // Find the user with the given google response
    let newProfile;
    let url = `/api/mongo/user/get/with-federalID/google/${googleResponse.profileObj.googleId}`;
    const userRes = await (await fetch(url)).json();

    // Respond according to the user database
    if(userRes.hasFound === 'found') newProfile = await handle_existing_user(props, userRes.data);
    else newProfile = await handle_new_user(props, googleResponse);

    // Save into the states
    props.setProfile({
      ...newProfile,
      isSignedIn: true,
      typeOfLogIn: 'google',
      subInfo: {hasData: false}
    });

    // finally
    props.setDataLoading(false);
  }

  return (
    <div>
      <GoogleLogin
        clientId={GOOGLE_CLIENT_ID}
        buttonText='Sign in with Google'
        onSuccess={(response) => {handleSuccessfulSignIn(response)}}
        onFailure={(response) => {handle_signin_error(props, response)}}
        cookiePolicy={ 'single_host_origin' }
        responseType='code,token'
        isSignedIn={true}
      />
    </div>
  );
}

export default GoogleSignIn;