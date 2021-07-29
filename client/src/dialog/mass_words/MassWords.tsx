// Mains import
import React, {Fragment, useState} from 'react';
import { useBeforeunload } from 'react-beforeunload';
// helpers import
import * as API from '../../API';
import { format_into_sem, today } from '../../utils'
import { State } from '../../types';
import ParsingAPI from './ParsingAPI';
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
import { modifyNewWordAddingType } from '../../redux/actions/supportAction';
// Redux Actions
import { offDialog, setSnackbar } from '../../redux/actions';
import { postWords } from '../../redux/actions/wordsAction';
import TagsList from '../../components/tags_list/TagsList';
// Declarations
const LETTERS_LIMITATION = 8000 // was able to handle 8,750
const VALID_YEAR_FROM = 2000;
const VALID_YEAR_TO = 2999;

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

  // Hook
  // When input is not blank then it prompts you to ask again before really leaving
  useBeforeunload((event: any) => {
    if (massData !== '') 
      event.preventDefault();
  });
  
  // Methods
  const handleMassDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setMassData(e.target.value);
    setCount(e.target.value.length);
    if(LETTERS_LIMITATION < e.target.value.length) {
      setMaxError(true);
      setMassData(e.target.value.slice(0, LETTERS_LIMITATION))
    }else{
      setMaxError(false);
    }
  }

  // ..Mehthod
  const cancelAddingMassWords = () => {
    if (massData !== '' /* if not empty in the box*/) setConfrimCancel(true);
    else store.dispatch(offDialog());
  };

  // ...Method
  const handleAddingMassData = () => {
    // Data validation
    if (massData.length === 0) 
      return store.dispatch(setSnackbar(tr.cannotBeEmpty[ln], 'warning'));
    let chosenYear, chosenSem = '';
    
    if(year !== '' || sem !== '') {
      // Data validation check.
      if(!API.checkValidDataOfExtraYear(year, sem, VALID_YEAR_FROM, VALID_YEAR_TO)) {
        store.dispatch(setSnackbar(`INVALID YEAR RANGE (${VALID_YEAR_FROM}~${VALID_YEAR_TO}) OR SEM (1~4)`, 'warning', 5))
        return;
      };

      chosenYear = year;
      chosenSem = sem;
    }
    else {
      chosenYear = today().year.toString();
      chosenSem = today().sem.toString();
    }

    store.dispatch(offDialog());
    const data = ParsingAPI(massData, format_into_sem(parseInt(chosenYear), parseInt(chosenSem)), tags)
    store.dispatch(postWords(data))
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
          <AvailableLangs />
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
            style={{width: '100%', textAlign:'center'}} multiline rows={5} rowsMax={20}
            value={massData} onChange={(e) => handleMassDataChange(e)}
            error={maxError}
            autoFocus
            onKeyDown={(event) => {
              if (shortcut.CMD_ENTER.mac.textField(event)) handleAddingMassData();
              else if (shortcut.CMD_ENTER.windows.textField(event)) handleAddingMassData(); // if you mix with the mac key, it somehow receives two enters
              else if (shortcut.ESC.general.textField(event)) cancelAddingMassWords();
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => cancelAddingMassWords()} color="secondary">
            {trAddWord.btnCancel[ln]}
          </Button>
          <Button onClick={() => handleAddingMassData()} color="primary" variant="contained">
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