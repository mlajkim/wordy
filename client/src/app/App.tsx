// eslint-disable-next-line
import { FC, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import axios from 'axios'
import { HotKeys } from "react-hotkeys"
import GoogleOneTapLogin from 'react-google-one-tap-login';
// Type
import { State } from '../types'
import { SEARCH_BAR_ID, GOOGLE_CLIENT_ID } from '../type/predefined'
import RELEASES from '../releases'
import { backgroundDark, backgroundLight, fontDark, fontLight } from '../theme';
import shortcut from '../shortcut'
import { generateAccessToken } from '../components/google_sign_in/GoogleSignIn'
// Lambda 
import { compareVersion } from '../type/sharedWambda'
// Library
import { cvtOneTapIntoGoogleRes } from '../frontendWambda'
// Component
import AppbarNotice from './AppbarNotice'
import Appbar  from './Appbar'
import * as API from '../API'
import {handleCountryCode} from '../utils'
// Pages
// mport Okr from './Okr'
import Dialog from './Dialog'
import Page from './Page'
import Snackbar from './Snackbar'
import appRunOnceLogic from './AppRunOnceLogic'
// Redux
import store from '../redux/store'
import { useSelector } from 'react-redux'
// Redux Action
import { setLanguage, setDialog } from '../redux/actions'
import { updateSupport } from '../redux/actions/supportAction'


const keyMap = {  
  OPEN_ADDER: [shortcut.CMD_ENTER.mac.hotKey, shortcut.CMD_ENTER.windows.hotKey],
  BEGIN_SEARCH: [shortcut.CMD_SHIFT_S.mac.hotKey, shortcut.CMD_SHIFT_S.windows.hotKey],
};

const App: FC = () => {
  const { support, dialog, user, language } = useSelector((state: State) => state);
  const ln = language

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
    appRunOnceLogic()
    
  }, []);

  // ! PatchNote
  useEffect(() => {
    if (!user.isSignedIn || support.lastReadVersion === "v0.0.0") return
    if (compareVersion(RELEASES[RELEASES[0].isFinished ? 0 : 1].version, support.lastReadVersion) !== 1) return

    store.dispatch(setDialog("PatchNote"))
  }, [user.isSignedIn, support.lastReadVersion, support.version])

  // Hotkey
  const hdlHotkey = {
    OPEN_ADDER: () => {
      if (!dialog.isOpen) {
        if (support.newWordAddingType === 'one') store.dispatch(setDialog('AddWordsDialog'));
        else store.dispatch(setDialog('MassWordsDialog'));
      }
    },
    BEGIN_SEARCH: () => {
      // Slight logical bug as new html is generated but it fails to find the search bar id. (if you hit the command again, it works)
      // if (!support.extendedSearchBar) store.dispatch(modifySupport({ extendedSearchBar: true }, true));
      const foundSearchBar = document.getElementById(SEARCH_BAR_ID);
      if (foundSearchBar) foundSearchBar.focus();
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
            {/* Disable OKR 
            <Route path="/okr">
              <AppbarNotice />
              <Appbar />
              <Snackbar />
              <Dialog />
              <Okr />
            </Route>
            */}
            <Route path="">
              { !user.isSignedIn &&
                (
                  <GoogleOneTapLogin 
                    onError={(error: any) => console.log(error)}
                    onSuccess={(response) => {
                      const converted = cvtOneTapIntoGoogleRes(response)
                      generateAccessToken(converted, ln, true)
                    }}
                    googleAccountConfigs={{ client_id: GOOGLE_CLIENT_ID }} 
                  />
                )              
              }
              <AppbarNotice />
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