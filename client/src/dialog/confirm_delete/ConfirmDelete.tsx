import React, {Fragment} from 'react';
import * as API from '../../API';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { State, Word, WordData } from '../../types';
import axios from 'axios';
// Translation
import tr from './confirm_delete.tr.json';
// Redux
import store from '../../redux/store';
import {offDialog, setSnackbar, deleteOneWordFromData, deleteOneYear  } from '../../redux/actions';
import {useSelector} from 'react-redux';

type CustomPayloadType = { word: Word }

const  ConfirmDelete:React.FC= () => {
  const {language, dialog, words, user} = useSelector((state: State) => state);
  const ln = language;
  const payload = dialog.payload as CustomPayloadType;

  // @ ABSOLUTE
  const handleWordDelete = async () => {
    // @ ABSOLUTE
    // Delete Back
    axios.delete(`/api/v2/mongo/words/one/${payload.word._id}`, API.getAuthorization())
      .then(_res => {
        store.dispatch(setSnackbar(tr.deletedMessage[ln]))
        store.dispatch(offDialog());
      })

    // @ ABSOLUTE
    // Also has to delete years if that was the last word!
    // MAKES SURE THIS HAPPENS BEFORE DELETING THE WORD
    const found = words.find((datus: WordData) => datus.year === payload.word.year && datus.sem === payload.word.sem);
    if(!found) { // extreme error
      store.dispatch(setSnackbar('[ERROR] EXTREME LOGICAL ERROR', 'warning'));
      return;
    }
    if(found.data.length === 1) {
      // Backend
      axios.delete(
        `/api/v2/mongo/years/one/${user.ID}/${payload.word.year}/${payload.word.sem}`, 
        API.getAuthorization()
      );
      // Frontend
      store.dispatch(deleteOneYear(payload.word.year, payload.word.sem));
      
    }

    // @ ABSOLUTE
    // Delete Front
    store.dispatch(deleteOneWordFromData(payload.word._id, payload.word.year, payload.word.sem));

    
    
    
    
  };

  return (
    <Fragment>
      <Dialog
        open={true}
        onClose={() => store.dispatch(offDialog())}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{tr.title[ln]}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-word-confirm">
            {`${tr.word[ln]}: ${payload.word}`}
          </DialogContentText>
          <DialogContentText id="alert-dialog">
            {tr.ask[ln]}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => store.dispatch(offDialog())} color="primary">
            {tr.cancelBtn[ln]}
          </Button>
          <Button onClick={() => handleWordDelete()} color="secondary" autoFocus>
            {tr.deleteBtn[ln]}
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}

export default ConfirmDelete;