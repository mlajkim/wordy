// Main & Types
import React, {Fragment, useEffect, useState} from 'react';
import * as API from '../../API';
import { State } from '../../types';
import axios from 'axios';
// redux actions
import { useSelector } from 'react-redux';
import store from '../../redux/store';
import { setSnackbar } from '../../redux/actions';
// Redux Actins
import { updateScrabbly, authenticate, refreshScrabbly } from '../../redux/actions/scrabblyAction';
// Material UI Core
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
// Translation
import tr from './scrabbly.tr.json';
import { fetchy3 } from '../../redux/actions/apiAction';

export default function Scrabbly() {
  const { user, scrabbly, language } = useSelector((state: State) => state);
  const ln = language;

  useEffect(() => {
    store.dispatch(refreshScrabbly());
    store.dispatch(fetchy3('get', `/permissions/${user.ID}`, null, authenticate));
  }, [user.ID]);

  const Renderer = () => {
    if (scrabbly.step === 'initialize') return (
      <Backdrop open={true}>
        <CircularProgress color="inherit" /> <br />
        <h3>{tr.permissionChecking[ln]}</h3>
      </Backdrop>
    )
    else if (scrabbly.step === 'waiting') return (
      <Backdrop open={true}>
        <CircularProgress color="inherit" /> <br />
        <h3>{tr.pleaseWait[ln]}</h3>
      </Backdrop>
    )
    else return <NoPermission />
  }
  
  return (
    <Fragment>
      <Grid style={{textAlign: 'center', paddingTop: 50}}>
        <Renderer />
      </Grid>
    </Fragment>
  );
}

const NoPermission:React.FC = () => {
  const { user, language } = useSelector((state: State) => state);
  const ln = language;

  const [input, setInput] = useState('');
  const handleClick = async () => {
    if (input.length === 0) {
      store.dispatch(setSnackbar(tr.pleaseInputCode[ln], 'info'));
      return;
    }
    const isSuccessful = (await axios.get(`/api/v3/mongo/permissions/${user.ID}/${input}`, API.getAuthorization())).data.payload.isSuccessful;
    if (isSuccessful) {
      store.dispatch(updateScrabbly({step: 'waiting'}))
    } else {
      store.dispatch(setSnackbar(tr.wrongCode[ln], 'warning'));
    }
  }

  return (
    <Fragment>
      <div>
        <h3>{tr.noPermission[ln]}</h3>
        <h3>{tr.noPermissionSuggest[ln]}</h3>
        <TextField 
          required id="standard-required" size="small" value={input} onChange={(e) => setInput(e.target.value)}
          style={{ width: 350 }}
          inputProps={{ style: {textAlign: 'center'} }}
        />
        <br></br>
        <Button onClick={() => handleClick()}>{tr.insert[ln]}</Button>
      </div>
    </Fragment>
  )
}