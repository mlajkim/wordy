import React from 'react';

import List from './List/List';


export default function ShowCurrentPage(props) {
  let currentPage = props.page;
  let body;

  switch(currentPage) {
    case 'list':
      body = <List words={props.words}
                   setPage={props.setPage}/>
      break;

    default:
      body = <div></div>
  }

  return body;
}