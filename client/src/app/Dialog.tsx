import React from 'react';
import { useSelector } from "react-redux";
import { State } from '../types';
// Dialogs
import PatchNote from '../dialog/patchNote/PatchNote'
import LoginDialog from '../dialog/login_dialog/LoginDialog';
import WarningDialog from '../dialog/warning/WarningDialog';
import AddWordsDialog from '../dialog/add_word/AddWordsDialog';
import ConfirmDelete from '../dialog/confirm_delete/ConfirmDelete';
import MassWordsDialog from '../dialog/mass_words/MassWords';
import EditWordDialog from '../dialog/edit_word/EditWord';
import ShortcutDialog from '../dialog/shotcut_dialog/ShortcutDialog';
import SettingDialog from '../dialog/setting_dialog/SettingDialog';
// OKR
import GroupDialog from '../dialog/group_dialog/GroupDialog';
import CreateOkrObject from '../dialog/create_okr_object/CreateOkrObjectDialog';
import EditOkrObjectDialog from '../dialog/edit_okr_object/EditOkrObjectDialog';

const Dialog = () => {
  // states
  const {dialog} = useSelector((state: State) => state);

  switch(dialog.type) {
    case 'PatchNote':
      return <PatchNote />

    case 'EditOkrObject':
      return <EditOkrObjectDialog />

    case 'GroupDialog':
      return <GroupDialog />

    case 'CreateOkrObject': 
      return <CreateOkrObject />;

    case 'LoginDialog': 
      return <LoginDialog type='login' />;

    case 'SignUpDialog': 
      return <LoginDialog type='signup' />;

    case 'AddWordsDialog': 
      return <AddWordsDialog />;

    case 'MassWordsDialog': 
      return <MassWordsDialog />;

    case 'EditWord':
      return <EditWordDialog />;

    case 'SettingDialog':
      return <SettingDialog />

    case 'ShortcutDialog':
      return <ShortcutDialog />

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