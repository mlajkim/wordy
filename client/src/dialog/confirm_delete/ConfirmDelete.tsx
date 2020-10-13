import React, {Fragment} from 'react';
import * as API from '../../API';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { State, Word } from '../../types';
import axios from 'axios';
// Translation
import tr from './confirm_delete.tr.json';
// Redux
import store from '../../redux/store';
import {deleteWords} from '../../redux/actions/wordsAction';
import {offDialog, setSnackbar} from '../../redux/actions';
import {useSelector} from 'react-redux';

type CustomPayloadType = { sem: number, IDs: {ID: string}[] }

const  ConfirmDelete:React.FC= () => {
  const {language, dialog} = useSelector((state: State) => state);
  const ln = language;
  const {sem, IDs} = dialog.payload as CustomPayloadType;

  const handleDelete = () => {
    store.dispatch(offDialog());
    store.dispatch(setSnackbar(tr.deletedMessage[ln], 'info'));
    store.dispatch(deleteWords(sem, IDs));
  }
  
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
            {`${tr.tellNumberOfWords[ln]}: ${IDs.length}`}
          </DialogContentText>
          <DialogContentText id="alert-dialog">
            {tr.ask[ln]}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => store.dispatch(offDialog())} color="primary" autoFocus>
            {tr.cancelBtn[ln]}
          </Button>
          <Button onClick={() => handleDelete()} color="secondary">
            {tr.deleteBtn[ln]}
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}

export default ConfirmDelete;