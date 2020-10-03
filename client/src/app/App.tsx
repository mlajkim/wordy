// eslint-disable-next-line
import React, {useEffect} from 'react';
import Appbar from './Appbar';
import Cookies from 'js-cookie';
import axios from 'axios';
import {handleCountryCode} from '../utils';
// Mains
import Dialog from './Dialog';
import Page from './Page';
// Redux
import store from '../redux/store';
import {setDialog, setLanguage} from '../redux/actions';

const App = () => {
  useEffect(() => {
    // get IP Address and print first.
    axios.get(`/api/v2/ip/location`)
      .then(res => store.dispatch(setLanguage(handleCountryCode(res.data.payload))));
    
    // Check the google signin cookie
    const {G_AUTHUSER_H} = Cookies.get();
    
    if(G_AUTHUSER_H !== undefined) {
      store.dispatch(setDialog('LoginDialog'))
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