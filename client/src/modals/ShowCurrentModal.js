import React from 'react';

import SignInModal from './SignInModal/SignInModal';
import PatchNoteModal from './patchNoteModal/PatchNoteModal';
import PromoteModal from './promoteModal/PromoteModal';
import PayModal from './PayModal/PayModal';
import DeleteAccountModal from './deleteAccountModal/DeleteAccountModal';
import PauseResumeModal from './pause_resume_modal/PauseResumeModal.tsx';

export default function ShowCurrentModal(props) {
  let body;
  switch(props.modal.type) {
    case 'SignInModal':
      body = <SignInModal {... props}/>
      break;

    case 'PauseResumeModal':
      body = <PauseResumeModal {... props}/>
      break;

    case 'DeleteAccountModal':
      body = <DeleteAccountModal {...props} />
      break;

    case 'PayModal':
      body = <PayModal {... props}/>
      break;
    case 'PatchNoteModal':
      body = <PatchNoteModal {... props}/>;
      break;

    case 'PromoteModal':
      body = <PromoteModal {... props}/>
      break;

    default:
      body = null;
  }

  return body;
}