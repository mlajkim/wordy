// eslint-disable-next-line
import React, {useEffect} from 'react';
import Appbar from './Appbar';
import * as API from '../API';
import axios from 'axios';
import {handleCountryCode} from '../utils';
// Mains
import Dialog from './Dialog';
import Page from './Page';
import Snackbar from './Snackbar';
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
      API.handleEverySignIn(API.getAccessToken());
    }
  }, []);

  return (
    <div>
      <Appbar />
      <Snackbar />
      <Dialog />
      <Page />
    </div>
  )
};

export default App;