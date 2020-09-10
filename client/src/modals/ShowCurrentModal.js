import React from 'react';

import SignInModal from './SignInModal/SignInModal';

export default function ShowCurrentModal(props) {
  let body;
  switch(props.modal) {
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

    default:
      body = null;
  }

  return body;
}