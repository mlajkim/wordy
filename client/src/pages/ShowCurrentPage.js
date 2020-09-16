import React from 'react';

import Home from './home/Home';
import Setting from './Setting/Setting';


export default function ShowCurrentPage(props) {
  let currentPage = props.page;
  let body;

  switch(currentPage) {
    case '':
      body = <Home profile={props.profile}/>
      break;

    case 'setting':
      body = <Setting profile={props.profile}
                      setProfile={props.setProfile}
                      isSignedIn={props.isSignedIn}
                      setSignedIn={props.setSignedIn}
                      setPage={props.setPage}
                      setWords={props.setWords}
                      setSnackbar={props.setSnackbar}
                      />
      break;

    default:
      body = <div></div>
  }

  return body;
}