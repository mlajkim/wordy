// eslint-disable-next-line
import React, {Fragment} from 'react';
import * as API from '../../API';
import axios from 'axios';
// temporary
import {handleGettingUserIntoFront} from './GoogleSignInAPI'
//
import { GoogleRes, User } from '../../types';
import {GoogleLogin} from 'react-google-login';
import tr from './google_sign_in.tr.json'
import { Language } from '../../types';
// Credential
import {GOOGLE_CLIENT_ID} from '../../credential';
// Redux
import {useSelector} from 'react-redux';

type Props = {
  type: 'login' | 'signup';
}

const GoogleSignIn: React.FC<Props> = ({type}) => {
  const language = useSelector((state: {language: Language}) => state.language);
  const ln = language;
  
  const generateAccessToken = async (googleRes: GoogleRes) => {
    const {error, accessToken, expires} = await API.generateAccessToken('google', googleRes.googleId);
    if (error) return;
    API.addToken('login', accessToken, expires);
    API.handleEverySignIn(accessToken, googleRes, language);
  };

  return (
    <Fragment>
      <GoogleLogin
        clientId={GOOGLE_CLIENT_ID}
        buttonText={type === 'login' ? tr.btnTextLogin[ln] : tr.btnTextSignUp[ln]}
        onSuccess={(res: any) => {generateAccessToken(res)}}
        onFailure={(res: any) => console.log(res)}
        cookiePolicy={ 'single_host_origin' }
        responseType='code,token'
        isSignedIn={true}
      />
    </Fragment>
  );
}

export default GoogleSignIn;