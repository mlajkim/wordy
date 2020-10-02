// eslint-disable-next-line
import React, {useEffect} from 'react';
import Appbar from './Appbar';
import Cookies from 'js-cookie';
// Mains
import Dialog from './Dialog';
import Page from './Page';
// Redux
import store from '../redux/store';
import {setDialog} from '../redux/actions';

const App = () => {
  useEffect(() => {
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