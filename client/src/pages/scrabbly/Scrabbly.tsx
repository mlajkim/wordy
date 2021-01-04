// Main & Types
import React, {Fragment, useEffect} from 'react';
import { State } from '../../types';
import axios from 'axios';
// redux actions
import { useSelector } from 'react-redux';
import store from '../../redux/store';
// Redux Actins
import { authenticate, refreshScrabbly } from '../../redux/actions/scrabblyAction';
// Material UI Core
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid'
// Translation
import tr from './scrabbly.tr.json';
import { fetchy3 } from '../../redux/actions/apiAction';

export default function Scrabbly() {
  const { user, scrabbly } = useSelector((state: State) => state);

  useEffect(() => {
    store.dispatch(refreshScrabbly());
    store.dispatch(fetchy3('get', `/permissions/${user.ID}`, null, authenticate));
  }, []);

  const Renderer = () => {
    if (scrabbly.step === 'initialize') return (
      <Backdrop open={true}>
        <CircularProgress color="inherit" />
        <h3>{tr.permissionChecking['ko']}</h3>
      </Backdrop>
    )
    else return (
      <h3>Success</h3>
    )
  }
  
  return (
    <Fragment>
      <Grid style={{textAlign: 'center', paddingTop: 50}}>
        <Renderer />
      </Grid>
    </Fragment>
  );
}