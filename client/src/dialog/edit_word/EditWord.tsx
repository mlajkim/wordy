// Mains
import { FC, Fragment, useState } from 'react'
// Types
import { State, Word } from '../../types';
import { AddableLanguage, ADDABLE_LANGUAGES_LIST } from '../../type/generalType'
// Lambda
import { convertLegacyWordIntoPureWord } from '../../frontendWambda'
import { languageCodeIntoUserFriendlyFormat } from '../../type/sharedWambda'
// Translations
import tr from './edit_word.tr.json'
import trAvailableLangs from '../../components/available_langs/available_langs.tr.json'
import trAddWordsDialog from '../add_word/add_words_dialog.tr.json'
// shortcut
import shortcut from '../../shortcut'
// Material UI
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextField from '@material-ui/core/TextField'
// Redux
import store from '../../redux/store'
import { useSelector } from 'react-redux'
// Redux Actions
import { modifySupport } from '../../redux/actions/supportAction'
import { offDialog, setSnackbar } from '../../redux/actions'
import { modifyWords, newlyModifyWords } from '../../redux/actions/wordsAction'
// Material UI
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
// Component
import TagsList from '../../components/tags_list/TagsList'
import { throwEvent } from '../../frontendWambda'
import { WordEditWordsInput, WordPostWordsPayload } from '../../type/payloadType'
import { LegacyPureWord } from '../../type/legacyType'

// Export Default
const EditDialog: FC = () => {
  // Redux states
  const { language, dialog } = useSelector((state: State) => state)
  const ln = language
  const editingTargetWord: LegacyPureWord = dialog.payload as LegacyPureWord
  const [word, setWord] = useState(editingTargetWord.word)
  const [editLanguage, setEditLanguage] = useState(editingTargetWord.language)
  const [pronun, setPronun] = useState(editingTargetWord.pronun)
  const [meaning, setMeaning] = useState(editingTargetWord.meaning)
  const [example, setExample] = useState(editingTargetWord.example)
  const [tags, setTags] = useState<string[]>(editingTargetWord.tag)
  // AvailableLanguage
  const [open, setOpen] = useState(false);

  // Methods
  const handleSave = () => {
    // ! 1) Trim words
    const tword = word ? word.trim() : word
    const tpronun = pronun ? pronun.trim() : pronun
    const tmeaning = meaning ? meaning.trim() : meaning
    const texample = example ? example.trim() : example

    // ! 2) Apply edited one and convert into latest word model
    const input: WordEditWordsInput = [convertLegacyWordIntoPureWord({
      // Below is NOT changed here.
      imageWrn: editingTargetWord.imageWrn, sem: editingTargetWord.sem,
      // Below is changed by ender user
      tags, word: tword, pronun: tpronun, meaning: tmeaning, example: texample, 
      language: editLanguage, isFavorite: editingTargetWord.isFavorite
    }, editingTargetWord)]

    console.log(editingTargetWord)

    throwEvent("word:editWords", input)
      .then(RE => {
        if (RE.serverResponse !== "Accepted") return

        // ! 3) Edit front word
        store.dispatch(newlyModifyWords({
          type: "update", data: RE.payload as WordPostWordsPayload
        })) 

        // ! 4) Let ender user know
        store.dispatch(modifySupport({ searchingBegins: true }, true)); //? The hell was that?
        store.dispatch(setSnackbar(tr.editedMessage[ln], 'info'));
        store.dispatch(offDialog());
      })
  }

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
              onChange={(e) => setEditLanguage(e.target.value as AddableLanguage)}
            >
              {menuItems}
            </Select>
          </div>
          <TextField margin="dense" id='word' value={word} label={trAddWordsDialog.word[ln]} fullWidth onChange={(e) => setWord(e.target.value)} autoComplete={"off"}
            onKeyDown={(event) => {if (shortcut.CMD_ENTER.mac.textField(event)) handleSave()}}
          />
          <TextField margin="dense" id='pronun' value={pronun} label={trAddWordsDialog.pronun[ln]} fullWidth onChange={(e) => setPronun(e.target.value)} autoComplete={"off"}
            onKeyDown={(event) => {if (shortcut.CMD_ENTER.mac.textField(event)) handleSave()}}
            />
          <TextField margin="dense" id='meaning' value={meaning} label={trAddWordsDialog.meaning[ln]} fullWidth onChange={(e) => setMeaning(e.target.value)} autoComplete={"off"}
            onKeyDown={(event) => {if (shortcut.CMD_ENTER.mac.textField(event)) handleSave()}}
            />
          <TextField margin="dense" id='example' value={example} label={trAddWordsDialog.example[ln]} fullWidth onChange={(e) => setExample(e.target.value)} autoComplete={"off"}
            onKeyDown={(event) => {if (shortcut.CMD_ENTER.mac.textField(event)) handleSave()}}
            />
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
}

export default EditDialog