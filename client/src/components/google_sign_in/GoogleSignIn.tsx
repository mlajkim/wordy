// eslint-disable-next-line
import React, {Fragment} from 'react';
import {GoogleLogin} from 'react-google-login';
import tr from './google_sign_in.tr.json'
// Credential
import {GOOGLE_CLIENT_ID} from '../../credential';
// Redux
import {useSelector} from 'react-redux';
import { language } from '../../types';

const GoogleSignIn: React.FC = () => {
  const ln = useSelector((state: {language: language}) => state.language);

  const handleSuccessfulSignIn = async (res: any) => {
    console.log(res);
  };

  const customStyle = {
    width: "fullwidth"
  }

  return (
    <Fragment>
      <GoogleLogin
        clientId={GOOGLE_CLIENT_ID}
        buttonText={tr.btnText[ln]}
        onSuccess={(res: any) => {handleSuccessfulSignIn(res)}}
        onFailure={(res: any) => null}
        cookiePolicy={ 'single_host_origin' }
        responseType='code,token'
        isSignedIn={true}
      />
    </Fragment>
  );
}

export default GoogleSignIn;