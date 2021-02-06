// Mains & Types
import React, {useState} from 'react';
import * as API from '../../API';
import { format_into_sem, today } from '../../utils'
import { State } from '../../types';
import ParsingAPI from './ParsingAPI';
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
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
// icons
import SwitchBackToOneMode from '@material-ui/icons/AddBox';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
// Redux
import store from '../../redux/store';
import {useSelector} from 'react-redux';
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
  const {user, language, support} = useSelector((state: State) => state);
  const ln = language;
  // Component states
  const [count, setCount] = useState(0);
  const [massData, setMassData] = useState('');
  const [maxError, setMaxError] = useState(false);
  const [tags, setTags] = useState<string[]>(support.lastTags);
  
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

  // ...Method
  const handleAddingMassData = () => {
    // Year and Sem by the date today.
    const year = today().year.toString();
    const sem = today().sem.toString();

    // Data validation check.
    if(!API.checkValidDataOfExtraYear(year, sem, VALID_YEAR_FROM, VALID_YEAR_TO)) {
      store.dispatch(setSnackbar(`INVALID YEAR RANGE (${VALID_YEAR_FROM}~${VALID_YEAR_TO}) OR SEM (1~4)`, 'warning', 5))
      return;
    };

    store.dispatch(offDialog());
    const data = ParsingAPI(massData, format_into_sem(parseInt(year), parseInt(sem)), tags)
    store.dispatch(postWords(data))
    store.dispatch(setSnackbar(trAddWord.successAddWord[ln]));
  };

  // Return
  return (
    <div>
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
            onClick={() => API.handleNewWordAddingType(user.ID!, 'one')}>
            <SwitchBackToOneMode />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <AvailableLangs />
          
          <TagsList tags={tags} setTags={setTags} />
          <TextField required id="standard-required" label={`Data ${count}/${LETTERS_LIMITATION}`}
            style={{width: '100%', textAlign:'center'}} multiline rows={5} rowsMax={20}
            value={massData} onChange={(e) => handleMassDataChange(e)}
            error={maxError}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => store.dispatch(offDialog())} color="secondary">
            {trAddWord.btnCancel[ln]}
          </Button>
          <Button onClick={() => handleAddingMassData()} color="primary" variant="contained">
            {trAddWord.btnOkay[ln]}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default MassWords;


/*
  <TextField margin="dense" label={trAddWord.year[ln]} 
            fullWidth value={year} 
            onChange={(e) => setYear(e.target.value)}
          />
          <TextField margin="dense" label={trAddWord.sem[ln]}  
            fullWidth value={sem}
            onChange={(e) => setSem(e.target.value)}
          />
*/