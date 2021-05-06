// Mains
import React, { Fragment, useState } from 'react';
// Translations
import tr from './edit_word.tr.json';
import trAvailableLangs from '../../components/available_langs/available_langs.tr.json';
import trAddWordsDialog from '../add_word/add_words_dialog.tr.json';
// Types
import { State, Word } from '../../types';
import { ADDABLE_LANGUAGES_LIST } from '../../type/generalType';
import { languageCodeIntoUserFriendlyFormat } from '../../type/sharedWambda';
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
// Material UI
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
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
  const [editLanguage, setEditLanguage] = useState(prevWord.language);
  const [pronun, setPronun] = useState(prevWord.pronun); 
  const [meaning, setMeaning] = useState(prevWord.meaning); 
  const [example, setExample] = useState(prevWord.example);
  const [tags, setTags] = useState<string[]>(prevWord.tag);
  // AvailableLanguage
  const [open, setOpen] = React.useState(false);

  // Methods
  const handleSave = () => {
    store.dispatch(offDialog());
    store.dispatch(setSnackbar(tr.editedMessage[ln], 'info'));
    store.dispatch(modifyWords(prevWord.sem, [{wordID: prevWord._id, payload: {word, pronun, meaning, example, tag: tags, language: editLanguage}}]));
  };

  // TSX
  const menuItems = ADDABLE_LANGUAGES_LIST.map(lang => (
    <MenuItem key={lang} value={lang}>{ languageCodeIntoUserFriendlyFormat(lang) }</MenuItem>
  ));

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
          <div style={{ display: 'inline-flex' }}>
            <InputLabel id="demo-controlled-open-select-label" style= {{ paddingTop: 7 }}>{trAvailableLangs.selectLang[language]}</InputLabel>
            <Select
              style={{ marginLeft: 5 }}
              labelId="demo-controlled-open-select-label"
              id="demo-controlled-open-select"
              open={open}
              onClose={() => setOpen(false)}
              onOpen={() => setOpen(true)}
              value={editLanguage}
              onChange={(e) => setEditLanguage(e.target.value as string)}
            >
              {menuItems}
            </Select>
          </div>
          <TextField margin="dense" id='word' value={word} label={trAddWordsDialog.word[ln]} fullWidth onChange={(e) => setWord(e.target.value)}/>
          <TextField margin="dense" id='pronun' value={pronun} label={trAddWordsDialog.pronun[ln]} fullWidth onChange={(e) => setPronun(e.target.value)}/>
          <TextField margin="dense" id='meaning' value={meaning} label={trAddWordsDialog.meaning[ln]} fullWidth onChange={(e) => setMeaning(e.target.value)}/>
          <TextField margin="dense" id='example' value={example} label={trAddWordsDialog.example[ln]} fullWidth onChange={(e) => setExample(e.target.value)}/>
          <TagsList tags={tags} setTags={setTags} />
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
};