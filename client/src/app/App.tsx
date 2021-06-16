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
import appRunOnceLogic from './AppRunOnceLogic';
// Redux
import store from '../redux/store';
import { useSelector } from 'react-redux';
// Action
import { setLanguage } from '../redux/actions';
import { updateSupport } from '../redux/actions/supportAction';
// Theme
import { backgroundDark, backgroundLight, fontDark, fontLight } from '../theme';
// Types
import { State } from '../types';


const App = () => {
  const { support} = useSelector((state: State) => state);

  useEffect(() => {
    // Check the dark API token exists, if yes, apply.
    const darkLightModeCookieData = API.readCookie('darkLightModeCookie');
    if(typeof darkLightModeCookieData !== "undefined") {
      store.dispatch(updateSupport({ isDarkMode: darkLightModeCookieData === 'dark' }));
    };

    // get IP Address and read country code. And change the language accorindgly. 
    axios.get(`/api/v2/ip/location`)
      .then(res => store.dispatch(setLanguage(handleCountryCode(res.data.payload))));

    // Check the google signin cookie
    if(typeof API.getAccessToken() !== "undefined") {
      API.handleEverySignIn(API.getAccessToken());
    };

    // Latest apigateway structure
    appRunOnceLogic();
  }, []);

  return (
    <div style={{ 
      background: support.isDarkMode ? backgroundDark : backgroundLight,
      color: support.isDarkMode ? fontDark : fontLight,
      height: 2000
    }}>
      <Appbar />
      <Snackbar />
      <Dialog />
      <Page />
    </div>
  )
};

export default App;