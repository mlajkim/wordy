import React from 'react';

import List from './List/List';
import Welcome from './Welcome/Welcome';


export default function ShowCurrentPage(props) {
  let currentPage = props.page;
  let body;

  switch(currentPage) {
    case 'welcome':
      body = <Welcome />
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