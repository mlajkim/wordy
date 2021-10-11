import { FC, Fragment, useState } from 'react'
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
import { newlyModifyWords } from '../../redux/actions/wordsAction'
// Redux Action
import { modifySupport } from '../../redux/actions/supportAction'
import { offDialog, setSnackbar } from '../../redux/actions'
import { useSelector } from 'react-redux'
import { WordDeleteWordsInput, WordDeleteWordsPayload } from '../../type/payloadType';

const  ConfirmDelete: FC = () => {
  // States
  const {language, dialog} = useSelector((state: State) => state)
  const ln = language
  const deletingTargets = dialog.payload as LegacyPureWord[]
  const [tempOpen, setTempOpen] = useState(true)
  

  // Methods
  const handleDelete = () => {
    setTempOpen(false)
    const deleltingLength = deletingTargets.length

    const input: WordDeleteWordsInput = { deletingWrns: deletingTargets.map(el => el.wrn) }
    throwEvent("word:deleteWords", input)
    .then(HE => {
      if (HE.serverResponse !== "Accepted") { setTempOpen(true); return }
      const payload = HE.payload as WordDeleteWordsPayload

      // if deletedCnt is not 1, then its fail...
      console.log(deleltingLength)
      console.log(payload.deleted.cnt)
      if (payload.deleted.cnt !== deleltingLength) {
        store.dispatch(setSnackbar(
          `${tr.someNotDeletedFront[ln]}${deleltingLength}${tr.someNotDeletedBack[ln]}${payload.deleted.cnt}`, 
          'warning'
        ))
        store.dispatch(offDialog())
        return
      }
        

      store.dispatch(newlyModifyWords({
        type: "delete", data: deletingTargets, wrns: payload.deleted.wrns
      }))
      store.dispatch(modifySupport({ searchingBegins: true }, true)) // ? Still do not understand wth this is lol ..
      store.dispatch(setSnackbar(tr.deletedMessage[ln]))
      store.dispatch(offDialog())
    })

    // store.dispatch(deleteWords(sem, IDs));
  }
  
  return (
    <Fragment>
      <Dialog
        open={tempOpen}
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