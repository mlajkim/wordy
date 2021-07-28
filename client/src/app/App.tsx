// eslint-disable-next-line
import React, {useEffect} from 'react';
import Appbar from './Appbar';
import * as API from '../API';
import axios from 'axios';
import {handleCountryCode} from '../utils';
// Hotkeys
import { HotKeys } from "react-hotkeys";
// Mains
import Dialog from './Dialog';
import Page from './Page';
import Snackbar from './Snackbar';
import appRunOnceLogic from './AppRunOnceLogic';
// Redux
import store from '../redux/store';
import { useSelector } from 'react-redux';
// Action
import { setLanguage, setDialog } from '../redux/actions';
import { updateSupport } from '../redux/actions/supportAction';
// Theme
import { backgroundDark, backgroundLight, fontDark, fontLight } from '../theme';
// Types
import { State } from '../types';

const macWindows = (shortcut: string) => [`command+${shortcut}`, `ctrl+${shortcut}`];

const keyMap = {  
  OPEN_ADDER: "c"
};

const App = () => {
  const { support, dialog, page } = useSelector((state: State) => state);

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

    // Hotkey
    const hdlHotkey = {
      OPEN_ADDER: () => {
        if (!dialog.isOpen) {
          if (support.newWordAddingType === 'one') store.dispatch(setDialog('AddWordsDialog'));
          else store.dispatch(setDialog('MassWordsDialog'));
        }
      }
    };

  return (
    <HotKeys keyMap={keyMap} handlers={hdlHotkey}>
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
    </ HotKeys>
  )
};

export default App;