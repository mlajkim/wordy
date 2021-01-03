// Main & Types
import React, {Fragment, useEffect} from 'react';
import axios from 'axios';

import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
// import Button from '@material-ui/core/Button';
// import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
// Translation
import tr from './scrabbly.tr.json';

export default function Scrabbly() {

  useEffect(() => {
    axios.get('/api/v4/permissions/')
  }, []);
  
  return (
    <Fragment>
      <Backdrop open={true}>
        <CircularProgress color="inherit" />
        <h3>{tr.permissionChecking['ko']}</h3>
      </Backdrop>
    </Fragment>
  );
}