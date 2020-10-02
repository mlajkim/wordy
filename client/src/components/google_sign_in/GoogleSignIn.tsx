// eslint-disable-next-line
import React, {Fragment} from 'react';
import {GoogleLogin} from 'react-google-login';
import tr from './google_sign_in.tr.json'
// Credential
import {GOOGLE_CLIENT_ID} from '../../credential';
// Redux
import store from '../../redux/store';
import {setDialog} from '../../redux/actions';
import {useSelector} from 'react-redux';
import { Language } from '../../types';
// API
import {handleSignIn} from './GoogleSignInAPI';

type Props = {
  type: 'login' | 'signup';
}

const GoogleSignIn: React.FC<Props> = ({type}) => {
  const ln = useSelector((state: {language: Language}) => state.language);

  const handleSuccessfulSignIn = (res: any) => {
    store.dispatch(setDialog(''))
    handleSignIn(res);
  };

  return (
    <Fragment>
      <GoogleLogin
        clientId={GOOGLE_CLIENT_ID}
        buttonText={type === 'login' ? tr.btnTextLogin[ln] : tr.btnTextSignUp[ln]}
        onSuccess={(res: any) => {handleSuccessfulSignIn(res)}}
        onFailure={(res: any) => console.log(res)}
        cookiePolicy={ 'single_host_origin' }
        responseType='code,token'
        isSignedIn={true}
      />
    </Fragment>
  );
}

export default GoogleSignIn;