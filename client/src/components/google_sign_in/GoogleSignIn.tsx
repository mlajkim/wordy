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
import store from '../../redux/store';
import {setDialog, setSignedIn, setPage, setLanguage, setUser, setYears} from '../../redux/actions';

type Props = {
  type: 'login' | 'signup';
}

const GoogleSignIn: React.FC<Props> = ({type}) => {
  const ln = useSelector((state: {language: Language}) => state.language);

  const generateAccessToken = async (googleRes: GoogleRes) => {
    const {error, accessToken, expires} = await API.generateAccessToken('google', googleRes.googleId);
    if (error) return;
    API.addToken('login', accessToken, expires);
    store.dispatch(setDialog(''))
    store.dispatch(setPage('dashboard'))
    store.dispatch(setSignedIn(true))
    handleUser(accessToken);
  };

  const handleUser = async (accessToken: string) => {
    const { error, payload } = await API.checkIfUserExists(accessToken);
    if (error) return;
    setupFront(payload, accessToken);
  }

  const setupFront = async (user: any, accessToken: string) => {
    store.dispatch(setUser(user._id, user.lastName, user.firstName, user.imageUrl));
    store.dispatch(setLanguage(user.languagePreference))
    const { error, payload } = (await axios.get(`/api/v2/mongo/years/all/${user._id}`, {
      headers: {Authorization: `Bearer ${accessToken}`}
    })).data
    if(!error) store.dispatch(setYears(payload));
  }

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