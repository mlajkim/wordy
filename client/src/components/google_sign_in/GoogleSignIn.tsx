// eslint-disable-next-line
import React, { Fragment } from 'react';
import * as API from '../../API';
// types 
import { throwEvent } from '../../frontendWambda';
import { UserCreateUserInput } from '../../type/payloadType';
import { Language } from '../../types';
// Translation
import tr from './google_sign_in.tr.json'
// old type
import { GoogleRes } from '../../types';
import { GoogleLogin } from 'react-google-login';
// Credential
import { GOOGLE_CLIENT_ID } from '../../type/predefined';
// Redux
import store from '../../redux/store';
import { useSelector } from 'react-redux';
// Redux Action
import { setOkrReloadOn, setSnackbar } from '../../redux/actions';

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
    throwEvent("user:createUser", userInput)
      .then(() => store.dispatch(setOkrReloadOn()))

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