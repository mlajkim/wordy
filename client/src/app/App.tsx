// eslint-disable-next-line
import React, {useEffect} from 'react';
import Appbar from './Appbar';
import * as API from '../API';
import axios from 'axios';
import {handleCountryCode} from '../utils';
import {handleSignInWithAccessToken} from '../components/google_sign_in/GoogleSignInAPI'
// Mains
import Dialog from './Dialog';
import Page from './Page';
// Redux
import store from '../redux/store';
import {setLanguage} from '../redux/actions';

const App = () => {
  useEffect(() => {
    // get IP Address and print first.
    axios.get(`/api/v2/ip/location`)
      .then(res => store.dispatch(setLanguage(handleCountryCode(res.data.payload))));
    
    // Check the google signin cookie
    if(API.getAccessToken() !== undefined) {
      handleSignInWithAccessToken(API.getAccessToken())
    }
  }, []);

  return (
    <div>
      <Appbar />
      <Dialog />
      <Page />
    </div>
  )
};

export default App;