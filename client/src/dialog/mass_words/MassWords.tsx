// Mains import
import React, {Fragment, useState, useEffect} from 'react';
import { useBeforeunload } from 'react-beforeunload';
import ParsingAPI from './ParsingAPI';
// helpers import
import { runAfter, now } from '../../type/sharedWambda';
import { throwEvent } from '../../frontendWambda';
import * as API from '../../API';
import parsingMechanism from './ParsingAPI';
import { format_into_sem, today } from '../../utils'
// Type
import { State } from '../../types';
import { wordDetectLanguagePayload } from '../../type/payloadType';
// Shorcut
import shortcut from '../../shortcut';
// Components
import AvailableLangs from '../../components/available_langs/AvailableLangs';
// Translation
import tr from './mass_words.tr.json';
import trAddWord from '../add_word/add_words_dialog.tr.json';
// MUI
import IconButton from '@material-ui/core/IconButton';  
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
// icons
import SwitchBackToOneMode from '@material-ui/icons/AddBox';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
// Redux
import store from '../../redux/store';
import { useSelector } from 'react-redux';
import { modifyNewWordAddingType, modifySupport } from '../../redux/actions/supportAction';
// Redux Actions
import { offDialog, setSnackbar } from '../../redux/actions';
import { postWords } from '../../redux/actions/wordsAction';
import TagsList from '../../components/tags_list/TagsList';
// Declarations
const LETTERS_LIMITATION = 8000 // was able to handle 8,750
const VALID_YEAR_FROM = 2000;
const VALID_YEAR_TO = 2999;
export const DETECT_LANGUAGE_TIMER = 0.6; // seconds

const MassWords = () => {
  // Redux states
  const { language, support } = useSelector((state: State) => state);
  const ln = language;
  // Component states
  const [count, setCount] = useState(0);
  const [massData, setMassData] = useState('');
  const [maxError, setMaxError] = useState(false);
  const [tags, setTags] = useState<string[]>(support.lastTags);
  const [confirmCancel, setConfrimCancel] = useState<boolean>(false);
  const [year, setYear] = useState<string>('');
  const [sem, setSem] = useState<string>('');
  // detectLanguage Timer
  const [detectedLanguage, setDetectedLanguage] = useState<string>(''); // the language type 'en' | 'ja'
  const [detectApi, setDetectApi] = useState<"enabled" | "disabled">("enabled"); // if true, detect no longer works
  const [detectTimer, setDetectTimer] = useState<number>(0);
  const [enableDetect, setEnableDetect] = useState<boolean>(false);
  const [detectingTarget, setDetectingTarget] = useState<string>('');
  // Hook
  // When input is not blank then it prompts you to ask again before really leaving
  useBeforeunload((event: any) => {
    if (massData !== '') 
      event.preventDefault();
  });

  // Effect (Detector Timer)
  useEffect(() => {
    // Detect language API call
    const runDetectLanguage = (targetInput: string) => {
      throwEvent("word:detectLanguage", targetInput)
        .then(res => {
          if (res.serverResponse === 'Denied') {
            store.dispatch(modifySupport({ languageDetectionEnabled: false }));
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
        const currentInput = parsingMechanism(massData, 0, [])[0].word;
        if (currentInput !== detectingTarget && massData.length > 0){
          runDetectLanguage(currentInput);
        }
        setDetectingTarget(currentInput);
        setEnableDetect(false); // turns off the loading after the time.
        
      }, DETECT_LANGUAGE_TIMER * 1000);
      return () => clearInterval(interval);
    }
  }, [detectApi, detectTimer, massData, enableDetect, detectingTarget]);

  // Methods
  const handleMassDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const userInput = e.target.value;

    // detect language algorithm
    if (support.languageDetectionEnabled && detectApi === 'enabled' && userInput !== '') {
      setDetectTimer(runAfter(DETECT_LANGUAGE_TIMER));
      setEnableDetect(true)
    };

    setMassData(userInput);
    setCount(userInput.length); // visibile to end-user

    // I see, this change makes the length cannot exceed the limitatin
    if(LETTERS_LIMITATION < userInput.length) setMaxError(true);
    else setMaxError(false);
  };

  // ..Mehthod
  const cancelAddingMassWords = () => {
    if (massData !== '' /* if not empty in the box*/) setConfrimCancel(true);
    else store.dispatch(offDialog());
  };

  // ...Method
  const hdlAddMassWords = () => {
    // Data validation (cannot be empty)
    if (massData.length === 0) 
      return store.dispatch(setSnackbar(tr.cannotBeEmpty[ln], 'warning'));
    let chosenYear, chosenSem = '';
    
    // if year and semester has given
    if(year !== '' || sem !== '') {
      // Data validation check.
      if(!API.checkValidDataOfExtraYear(year, sem, VALID_YEAR_FROM, VALID_YEAR_TO)) {
        store.dispatch(setSnackbar(`INVALID YEAR RANGE (${VALID_YEAR_FROM}~${VALID_YEAR_TO}) OR SEM (1~4)`, 'warning', 5))
        return;
      };
      chosenYear = year;
      chosenSem = sem;
    } else {
      chosenYear = today().year.toString();
      chosenSem = today().sem.toString();
    };

    // length validator
    if (massData.length > LETTERS_LIMITATION) {
      store.dispatch(setSnackbar(tr.cannotExceedLimit[ln], 'warning', 5));
      return;
    };

    store.dispatch(offDialog());
    const data = ParsingAPI(massData, format_into_sem(parseInt(chosenYear), parseInt(chosenSem)), tags);
    store.dispatch(postWords(data));
    store.dispatch(setSnackbar(trAddWord.successAddWord[ln]));
  };

  // Return
  return (
    <Fragment>
      <Dialog
        open={true}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth='lg'
        onClose={() => cancelAddingMassWords()}
      >
        <DialogTitle id="alert-dialog-title">
          {tr.title[ln]}
          <Tooltip title={tr.help[ln]} placement="right" style={{ marginLeft: 5 }}>
            <HelpOutlineIcon />
          </Tooltip>
          <IconButton size='small' style={{display: 'block', float:'right',textAlign:'right'}} 
            onClick={() => store.dispatch(modifyNewWordAddingType('one'))}>
            <SwitchBackToOneMode />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <AvailableLangs 
          enableDetect={enableDetect}
            setDetectApi={setDetectApi} 
            detectedLanguage={detectedLanguage} 
            detectApi={detectApi}
          />
          {
            support.isYearQuadrantEnabled
              ? (
                <Fragment>
                  <TextField margin="dense" label={trAddWord.year[ln]} 
                    fullWidth value={year} 
                    onChange={(e) => setYear(e.target.value)}
                  />
                  <TextField margin="dense" label={trAddWord.sem[ln]}  
                    fullWidth value={sem}
                    onChange={(e) => setSem(e.target.value)}
                  />
                </Fragment>
              )
              : null
          }
          <TagsList tags={tags} setTags={setTags} />
          <TextField required id="standard-required" label={`Data ${count}/${LETTERS_LIMITATION}`}
            style={{width: '100%', textAlign:'center'}} multiline minRows={5} maxRows={20}
            value={massData} onChange={(e) => handleMassDataChange(e)}
            error={maxError}
            autoFocus
            autoComplete={"off"}
            onKeyDown={(event) => {
              if (shortcut.CMD_ENTER.mac.textField(event)) hdlAddMassWords();
              else if (shortcut.CMD_ENTER.windows.textField(event)) hdlAddMassWords(); // if you mix with the mac key, it somehow receives two enters
              else if (shortcut.ESC.general.textField(event)) cancelAddingMassWords();
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => cancelAddingMassWords()} color="secondary">
            {trAddWord.btnCancel[ln]}
          </Button>
          <Button onClick={() => hdlAddMassWords()} color="primary" variant="contained">
            {trAddWord.btnOkay[ln]}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={confirmCancel}
        onClose={() => setConfrimCancel(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{tr.confirmCancelTitle[ln]}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          {tr.confirmCancelExplain[ln]}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfrimCancel(false)} color="primary" autoFocus>
            {tr.confirmCancelDisagree[ln]}
          </Button>
          <Button onClick={() => store.dispatch(offDialog())} color="secondary">
            {tr.confirmCancelAgree[ln]}
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}

export default MassWords;