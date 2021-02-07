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
import { setLanguage } from '../redux/actions';
import { switchDarkLightMode } from '../redux/actions/supportAction';

const App = () => {
  useEffect(() => {
    // Check the dark API token
    const darkLightModeCookieData = API.readCookie('darkLightModeCookie');
    if(typeof darkLightModeCookieData === "undefined") {
      store.dispatch(switchDarkLightMode(darkLightModeCookieData));
    };

    // get IP Address and print first.
    axios.get(`/api/v2/ip/location`)
      .then(res => store.dispatch(setLanguage(handleCountryCode(res.data.payload))));
      console.log(API.readCookie('darkLightModeCookie'));

    // Check the google signin cookie
    if(typeof API.getAccessToken() !== "undefined") {
      API.handleEverySignIn(API.getAccessToken());
    };
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