// Mains
import React, { Fragment, useState } from 'react';
import { State, Word } from '../../types';
// Translations
import tr from './edit_word.tr.json';
import trAddWordsDialog from '../add_word/add_words_dialog.tr.json';
// Material UI
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
// Redux
import store from '../../redux/store';
import { useSelector } from 'react-redux';
// Redux Actions
import { offDialog, setSnackbar } from '../../redux/actions';
import { modifyWords } from '../../redux/actions/wordsAction';
// Components
import TagsList from '../../components/tags_list/TagsList';
// Within-component Types
type CustomPayloadType = {prevWord: Word, sem: number, IDs: {ID: string}[] }

// Export Default
export default function EditDialog() {
  // Redux states
  const { language, dialog } = useSelector((state: State) => state);
  const ln = language;
  const { prevWord } = dialog.payload as CustomPayloadType;
  const [word, setWord] = useState(prevWord.word);
  const [pronun, setPronun] = useState(prevWord.pronun); 
  const [meaning, setMeaning] = useState(prevWord.meaning); 
  const [example, setExample] = useState(prevWord.example);
  const [tags, setTags] = useState<string[]>(prevWord.tag);

  // Methods
  const handleSave = () => {
    store.dispatch(offDialog());
    store.dispatch(setSnackbar(tr.editedMessage[ln], 'info'));
    store.dispatch(modifyWords(prevWord.sem, [{wordID: prevWord._id, payload: {word, pronun, meaning, example, tag: tags}}]));
  };

  // Return
  return (
    <Fragment>
      <Dialog
        open={true}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{tr.title[ln]}</DialogTitle>
        <DialogContent>
          <TextField margin="dense" id='word' value={word} label={trAddWordsDialog.word[ln]} fullWidth onChange={(e) => setWord(e.target.value)}/>
          <TextField margin="dense" id='pronun' value={pronun} label={trAddWordsDialog.pronun[ln]} fullWidth onChange={(e) => setPronun(e.target.value)}/>
          <TextField margin="dense" id='meaning' value={meaning} label={trAddWordsDialog.meaning[ln]} fullWidth onChange={(e) => setMeaning(e.target.value)}/>
          <TextField margin="dense" id='example' value={example} label={trAddWordsDialog.example[ln]} fullWidth onChange={(e) => setExample(e.target.value)}/>
          <TagsList tags={prevWord.tag} setTags={setTags} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => store.dispatch(offDialog())} color="primary"> {trAddWordsDialog.btnCancel[ln]} </Button>
          <Button onClick={() => {handleSave()}} color="primary" autoFocus>
            {tr.btnConfirm[ln]}
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}