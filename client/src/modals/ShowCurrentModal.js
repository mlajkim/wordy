import React from 'react';

import SignInModal from './SignInModal/SignInModal';
import PatchNoteModal from './patchNoteModal/PatchNoteModal';
import PromoteModal from './promoteModal/PromoteModal';
import PayModal from './PayModal/PayModal';
import DeleteAccountModal from './deleteAccountModal/DeleteAccountModal';

export default function ShowCurrentModal(props) {
  let body;
  switch(props.modal.type) {
    case 'SignInModal':
      body = <SignInModal modal={props.modal}
                          setModal={props.setModal}
                          page={props.page}
                          setPage={props.setPage}
                          words={props.words}
                          setWords={props.setWords}
                          isSignedIn={props.isSignedIn}
                          setSignedIn={props.setSignedIn}
                          profile={props.profile}
                          setProfile={props.setProfile}
                          setDataLoading={props.setDataLoading}
                          setSnackbar={props.setSnackbar}/>
      break;

    case 'DeleteAccountModal':
      body = <DeleteAccountModal {...props} />
      break;

    case 'PayModal':
      body = <PayModal modal={props.modal}
                      setModal={props.setModal}
                      page={props.page}
                      setPage={props.setPage}
                      words={props.words}
                      setWords={props.setWords}
                      isSignedIn={props.isSignedIn}
                      setSignedIn={props.setSignedIn}
                      profile={props.profile}
                      setProfile={props.setProfile}
                      setDataLoading={props.setDataLoading}
                      setSnackbar={props.setSnackbar}/>
      break;
    case 'PatchNoteModal':
      body = <PatchNoteModal setModal={props.setModal}/>;
      break;

    case 'PromoteModal':
      body = <PromoteModal setModal={props.setModal}
                            profile={props.profile}/>
      break;

    default:
      body = null;
  }

  return body;
}