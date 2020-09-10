import React from 'react';

import List from './List/List';
import Welcome from './Welcome/Welcome';
import Introduce from './Introduce/Introduce'
import Setting from './Setting/Setting';


export default function ShowCurrentPage(props) {
  let currentPage = props.page;
  let body;

  switch(currentPage) {
    case 'welcome':
      body = <Welcome isSignedIn={props.isSignedIn}
                      setSignedIn={props.setSignedIn}
                      setWords={props.setWords}
                      setProfile={props.setProfile}
                      setDataLoading={props.setDataLoading}
                      setPage={props.setPage}
                      setModal={props.setModal}
                      setSnackbar={props.setSnackbar}/>
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

    case 'introduce':
      body = <Introduce profile={props.profile}/>
      break;

    case 'list':
      body = <List words={props.words}
                   setPage={props.setPage}/>
      break;

    default:
      body = <div></div>
  }

  return body;
}