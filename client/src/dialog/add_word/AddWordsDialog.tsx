import React, { useState, Fragment, useEffect } from 'react';
import { get_sem } from '../../utils';
import AvailableLangs from '../../components/available_langs/AvailableLangs';
// type
import { wordDetectLanguagePayload } from '../../type/payloadType';
import { throwEvent } from '../../frontendWambda';
import { runAfter, now } from '../../type/sharedWambda';
// imported constant data
import { DETECT_LANGUAGE_TIMER } from '../mass_words/MassWords';
// Material UI
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';  
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
// hotkey
import shortcut from '../../shortcut';
// Icons
import AddToPhotosIcon from '@material-ui/icons/AddToPhotos';
// Translation
import tr from './add_words_dialog.tr.json';
import { State } from '../../types';
// Redux
import store from '../../redux/store';
import { offDialog, setSnackbar } from '../../redux/actions';
import { modifyNewWordAddingType } from '../../redux/actions/supportAction';
import { useSelector } from 'react-redux';
import {postWords} from '../../redux/actions/wordsAction';
import TagsList from '../../components/tags_list/TagsList';

const AddWordsDialog: React.FC = () => {
  // Redux states
  const { language, support } = useSelector((state: State) => state);
  const ln = language;
  // Component states
  const [word, setWord] = useState('');
  const [pronun, setPronun] = useState('' ); 
  const [meaning, setMeaning] = useState(''); 
  const [example, setExample] = useState(''); 
  const [tags, setTags] = useState<string[]>(support.lastTags);
  // detectLanguage Timer
  const [detectedLanguage, setDetectedLanguage] = useState<string>(''); // the language type 'en' | 'ja'
  const [detectApi, setDetectApi] = useState<"enabled" | "disabled">("enabled"); // if true, detect no longer works
  const [detectTimer, setDetectTimer] = useState<number>(0);
  const [enableDetect, setEnableDetect] = useState<boolean>(false);
  const [detectingTarget, setDetectingTarget] = useState<string>('');
  // Hook

  // Effect (Detector Timer)
  useEffect(() => {
    // Detect language API call
    const runDetectLanguage = (targetInput: string) => {
      throwEvent("word:detectLanguage", targetInput)
        .then(res => {
          if (res.serverResponse === 'Denied') {
            setDetectApi("disabled");
            setEnableDetect(false);
          } else {
            // now detection happens!
            const payload = res.payload as wordDetectLanguagePayload;
            if(payload.length > 0) setDetectedLanguage(payload[0].language);
          }
        });
    };

    if (detectApi === 'enabled' && enableDetect && detectTimer > now()) {
      const interval = setInterval(() => {
        if (word !== detectingTarget && word.length > 0){
          runDetectLanguage(word);
        }
        setDetectingTarget(word);
        setEnableDetect(false); // turns off the loading after the time.
        
      }, DETECT_LANGUAGE_TIMER * 1000);
      return () => clearInterval(interval);
    }
  }, [detectApi, detectTimer, word, enableDetect, detectingTarget]);
  const hdlWordChange = (userInput: string) => {
    // detect language algorithm
    if (detectApi === 'enabled' && userInput !== '') {
      setDetectTimer(runAfter(DETECT_LANGUAGE_TIMER));
      setEnableDetect(true)
    };

    setWord(userInput);
  };

  // Methods
  const handleSavingWords = () => {
    store.dispatch(offDialog());
    store.dispatch(setSnackbar(tr.successAddWord[ln]));
    const sem = get_sem();
    store.dispatch(postWords([{ word, pronun, meaning, example, isPublic: false, sem, tag: tags }]));
  } 

  return (
    <Fragment>
      <Dialog open={true}>
        <DialogTitle id="form-dialog-title">
          <span>{tr.title[ln]}</span>
          <IconButton size='small' style={{display: 'block', float:'right',textAlign:'right'}} 
            onClick={() => store.dispatch(modifyNewWordAddingType('mass'))}>
            <AddToPhotosIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <AvailableLangs 
            enableDetect={enableDetect}
            setDetectApi={setDetectApi} 
            detectedLanguage={detectedLanguage} 
            detectApi={detectApi}
          />
          <TextField margin="dense" id="word" label={tr.word[ln]} fullWidth value={word} onChange={(e) => hdlWordChange(e.target.value)} 
            onKeyDown={(event) => {if (shortcut.CMD_ENTER.mac.textField(event)) handleSavingWords()}}
          />
          <TextField margin="dense" id="pronun" label={tr.pronun[ln]} fullWidth value={pronun} onChange={(e) => setPronun(e.target.value)} 
            onKeyDown={(event) => {if (shortcut.CMD_ENTER.mac.textField(event)) handleSavingWords()}}
          />
          <TextField margin="dense" id="define" label={tr.meaning[ln]} fullWidth value={meaning} onChange={(e) => setMeaning(e.target.value)} 
            onKeyDown={(event) => {if (shortcut.CMD_ENTER.mac.textField(event)) handleSavingWords()}}
          />
          <TextField margin="dense" id="example" label={tr.example[ln]} fullWidth value={example} onChange={(e) => setExample(e.target.value)} 
            onKeyDown={(event) => {if (shortcut.CMD_ENTER.mac.textField(event)) handleSavingWords()}}
          />
          <TagsList tags={tags} setTags={setTags} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => store.dispatch(offDialog())} color="secondary">
            {tr.btnCancel[ln]}
          </Button>
          <Button color="primary" variant="contained" onClick={() => handleSavingWords()}>
            {tr.btnOkay[ln]}
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}

export default AddWordsDialog;