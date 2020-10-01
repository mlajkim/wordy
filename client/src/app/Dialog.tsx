import React from 'react';
import { useSelector } from "react-redux";
// Dialogs
import LoginDialog from '../dialog/LoginDialog';

const Dialog = () => {
  const dialog = useSelector((state: any) => state.dialog);

  switch(dialog) {
    case 'LoginDialog': 
      return <LoginDialog />;

    default:
      return null;
  }
}

export default Dialog;