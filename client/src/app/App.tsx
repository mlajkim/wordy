// eslint-disable-next-line
import React, {useEffect} from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Appbar from './Appbar';
import * as API from '../API';
import axios from 'axios';
import {handleCountryCode} from '../utils';
// Hotkeys
import { HotKeys } from "react-hotkeys";
import shortcut from '../shortcut';
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
import HelpOutline from '@material-ui/icons/HelpOutline';

const keyMap = {  
  OPEN_ADDER: [shortcut.CMD_ENTER.mac.hotKey, shortcut.CMD_ENTER.windows.hotKey]
};

const App: React.FC = () => {
  const { support, dialog } = useSelector((state: State) => state);

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
        minHeight: "100vh" // Legendary Yikumi solved my 1.5 years of my life zzzzzzz
      }}>
        <Router>
          <Switch>
            <Route path="/okr" exact>
              {"hello okr!?"}
            </Route>
            <Route path="">
              <Appbar />
              <Snackbar />
              <Dialog />
              <Page />
            </Route>
          </Switch>
        </Router>
      </div>
    </ HotKeys>
  )
};

export default App;