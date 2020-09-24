import React from 'react';
// Pages
import Admin from './admin/Admin';
import Setting from './Setting/Setting';


export default function ShowCurrentPage(props) {
  let currentPage = props.page;
  let body;

  switch(currentPage) {
    case '':
      body = null;
      break;

    case 'admin':
      body = <Admin {... props}/>
      break;

    case 'setting':
      body = <Setting {... props}/>
      break;

    default:
      body = <div></div>
  }

  return body;
}