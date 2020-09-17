import React from 'react';

import Home from './home/Home';
import Admin from './admin/Admin';
import Setting from './Setting/Setting';


export default function ShowCurrentPage(props) {
  let currentPage = props.page;
  let body;

  switch(currentPage) {
    case '':
      body = <Home profile={props.profile}/>
      break;

    case 'admin':
      body = <Admin profile={props.profile}/>
      break;

    case 'setting':
      body = <Setting profile={props.profile}
                      setProfile={props.setProfile}
                      isSignedIn={props.isSignedIn}
                      setSignedIn={props.setSignedIn}
                      setPage={props.setPage}
                      setWords={props.setWords}
                      setSnackbar={props.setSnackbar}
                      setModal={props.setModal}
                      />
      break;

    default:
      body = <div></div>
  }

  return body;
}