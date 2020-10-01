import React from 'react';
import store from '../redux/store';
import { useSelector } from "react-redux";

// Dialogs
import LoginDialog from '../dialog/LoginDialog';

const Dialog = () => {
  const dialog = store.getState().dialog;
  store.subscribe(() => {
    console.log("store changed: ", store.getState())
  });
  switch(dialog) {
    case 'LoginDialog': 
      return <LoginDialog />;

    default:
      return null;
  }
}

export default Dialog;