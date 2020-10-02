import React from 'react';
import { useSelector } from "react-redux";
// Dialogs
import LoginDialog from '../dialog/login_dialog/LoginDialog';

const Dialog = () => {
  // states
  const dialog = useSelector((state: any) => state.dialog);

  switch(dialog) {
    case 'LoginDialog': 
      return <LoginDialog type='login' />;

    case 'SignUpDialog': 
      return <LoginDialog type='signup' />;

    default:
      return null;
  }
}

export default Dialog;