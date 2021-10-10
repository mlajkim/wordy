import React, {Fragment} from 'react';
// Type
import { LegacyPureWord } from '../../type/legacyType'
// Lambda
import { throwEvent } from '../../frontendWambda'
// MUI
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import { State } from '../../types'
// Translation
import tr from './confirm_delete.tr.json'
// Redux
import store from '../../redux/store'
import { deleteWords } from '../../redux/actions/wordsAction'
// Redux Action
import { modifySupport } from '../../redux/actions/supportAction'
import { offDialog, setSnackbar } from '../../redux/actions'
import { useSelector } from 'react-redux'

const  ConfirmDelete:React.FC= () => {
  // Redux States
  const {language, dialog} = useSelector((state: State) => state);
  const ln = language;
  const deletingTargets = dialog.payload as LegacyPureWord[];

  // Methods
  const handleDelete = () => {

    // ? legacy code
    // store.dispatch(modifySupport({ searchingBegins: true }, true));
    // store.dispatch(offDialog());
    // store.dispatch(setSnackbar(tr.deletedMessage[ln]));
    // store.dispatch(deleteWords(sem, IDs));
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
            {`${tr.tellNumberOfWords[ln]}: ${deletingTargets.length}`}
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