// eslint-disable-next-line
import React, { Fragment, useState } from 'react';
import * as API from '../../API';
// types 
import { throwEvent } from '../../frontendWambda';
import { UserCreateUserInput } from '../../type/payloadType';
// old type
import { GoogleRes } from '../../types';
import {GoogleLogin} from 'react-google-login';
// Translation
import tr from './google_sign_in.tr.json'
import { Language } from '../../types';
// Credential
import {GOOGLE_CLIENT_ID} from '../../credential';
// Redux
import store from '../../redux/store';
import {useSelector} from 'react-redux';
import {setOkrReloadOn, setSnackbar} from '../../redux/actions';

type Props = {
  type: 'login' | 'signup';
}

const GoogleSignIn: React.FC<Props> = ({type}) => {
  const language = useSelector((state: {language: Language}) => state.language);
  const ln = language;

  const generateAccessToken = async (googleRes: GoogleRes) => {
    const {error, accessToken, expires} = await API.generateAccessToken(googleRes);

    // error handling
    if (error) return;

    // newUserApi called
    const userInput: UserCreateUserInput = {
      federalProvider: "google", validatingToken: googleRes.tokenId
    }
    throwEvent("user:createUser", userInput);
    store.dispatch(setOkrReloadOn());

    API.addToken('login', accessToken, expires);
    API.handleEverySignIn(accessToken, googleRes, language);
    if (type === 'login') store.dispatch(setSnackbar(tr.successfulSignIn[ln]));
    else if (type === 'signup') store.dispatch(setSnackbar(tr.successfulSignUp[ln]));
  };

  return (
    <Fragment>
      <GoogleLogin
        clientId={GOOGLE_CLIENT_ID}
        buttonText={type === 'login' ? tr.btnTextLogin[ln] : tr.btnTextSignUp[ln]}
        onSuccess={(res: any) => {
          generateAccessToken(res);
        }}
        onFailure={(res: any) => console.log(res)}
        cookiePolicy={ 'single_host_origin' }
        responseType='code,token'
        isSignedIn={true}
      />
    </Fragment>
  );
}

export default GoogleSignIn;