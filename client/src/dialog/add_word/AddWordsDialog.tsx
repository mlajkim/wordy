import React, {useState, Fragment} from 'react';
import axios from 'axios';
import * as API from '../../API';
import AvailableLangs from '../../components/available_langs/AvailableLangs';
import moment from 'moment';
import {format_into_sem, get_sem} from '../../utils';
// Material UI
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';  
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
// Icons
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import AddToPhotosIcon from '@material-ui/icons/AddToPhotos';
// Translation
import tr from './add_words_dialog.tr.json';
import {State, Word} from '../../types';
// Redux
import store from '../../redux/store';
import {
  offDialog, addYears, setSnackbar, incrementAddedWordsCount 
} from '../../redux/actions';
import {useSelector} from 'react-redux';
import {addWords} from '../../redux/actions/words';

// @ ABSOLUTE
export const VALID_YEAR = { from: 2000, to: 2020 };



const AddWordsDialog: React.FC = () => {
  // Redux states
  const {language, user, languages, years} = useSelector((state: State) => state);
  const ln = language;
  // Component states
  const [word, setWord] = useState('');
  const [pronun, setPronun] = useState('' ); 
  const [meaning, setMeaning] = useState(''); 
  const [example, setExample] = useState(''); 
  const [isPublic, setPublic] = useState(true);
  // Extra Component states
  const [isShowingExtra, setShowingExtra] = useState(false);
  const [extraYear, setExtraYear] = useState('');
  const [extraSem, setExtraSem] = useState('');

  const handleSavingWords = () => {
    const sem = isShowingExtra ? format_into_sem(parseInt(extraYear), parseInt(extraSem)) : get_sem();
    store.dispatch(addWords([{
      word, pronun, meaning, example, isPublic, sem
    }]))
  }

  return (
    <div>
      {extraYear}
      <Dialog open={true} onClose={() => store.dispatch(offDialog())}>
        <DialogTitle id="form-dialog-title">
          <span>{tr.title[ln]}</span>
          <IconButton disabled size='small' style={{display: 'block', float:'right',textAlign:'right'}} 
            onClick={() => API.handleNewWordAddingType(user.ID!, 'mass')}>
            <AddToPhotosIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <AvailableLangs />
          <TextField autoFocus margin="dense" id="word" label={tr.word[ln]} fullWidth value={word} onChange={(e) => setWord(e.target.value)}/>
          <TextField margin="dense" id="pronun" label={tr.pronun[ln]} fullWidth value={pronun} onChange={(e) => setPronun(e.target.value)}/>
          <TextField margin="dense" id="define" label={tr.meaning[ln]} fullWidth value={meaning} onChange={(e) => setMeaning(e.target.value)}/>
          <TextField margin="dense" id="example" label={tr.example[ln]} fullWidth value={example} onChange={(e) => setExample(e.target.value)}/>
          {tr.askForPublic[ln]}
          <FormControlLabel
            value="end"
            control={<Switch checked={isPublic} onChange={() => setPublic(!isPublic)} color="primary" />}
            label={isPublic ? tr.printPublicTrue[ln] : tr.printPublicFalse[ln]}
            labelPlacement="end"
          />
          {isShowingExtra
            ? (
              <Fragment>
                <TextField margin="dense" label={tr.year[ln]} 
                  fullWidth value={extraYear} 
                  onChange={(e) => setExtraYear(e.target.value)}
                />
                <TextField margin="dense" label={tr.sem[ln]}  
                  fullWidth value={extraSem}
                  onChange={(e) => setExtraSem(e.target.value)}
                />
              </Fragment>
              )
            : (
              <Fragment>
                <IconButton onClick={() => setShowingExtra(true)}>
                  <ArrowDropDownIcon />
                </IconButton>
              </Fragment>
            )
          }
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
    </div>
  );
}

export default AddWordsDialog;