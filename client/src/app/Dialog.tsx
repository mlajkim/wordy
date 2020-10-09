import React from 'react';
import { useSelector } from "react-redux";
import { State } from '../types';
// Dialogs
import LoginDialog from '../dialog/login_dialog/LoginDialog';
import WarningDialog from '../dialog/warning/WarningDialog';
import AddWordsDialog from '../dialog/add_word/AddWordsDialog';
import ConfirmDelete from '../dialog/confirm_delete/ConfirmDelete';
import MassWordsDialog from '../dialog/mass_words/MassWords';


const Dialog = () => {
  // states
  const {dialog} = useSelector((state: State) => state);

  switch(dialog.type) {
    case 'LoginDialog': 
      return <LoginDialog type='login' />;

    case 'SignUpDialog': 
      return <LoginDialog type='signup' />;

    case 'AddWordsDialog': 
      return <AddWordsDialog />;

    case 'MassWordsDialog': 
      return <MassWordsDialog />;

    case 'ConfirmDelete':
      return <ConfirmDelete />

    case 'Warning401': 
      return <WarningDialog status="401" />;

    case 'Warning403': 
      return <WarningDialog status="403" />;
    default:
      return null;
  }
}

export default Dialog;