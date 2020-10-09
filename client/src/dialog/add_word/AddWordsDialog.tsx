import React, {useState, Fragment} from 'react';
import axios from 'axios';
import * as API from '../../API';
import AvailableLangs from '../../components/available_langs/AvailableLangs';
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
// Translation
import tr from './add_words_dialog.tr.json';
import {State, Word} from '../../types';
// Redux
import store from '../../redux/store';
import {offDialog, addYears, addOneWordIntoData, setSnackbar, incrementAddedWordsCount } from '../../redux/actions';
import {useSelector} from 'react-redux';

const syncYearsDB = (doubleCheck: boolean, ownerID: string, year: number, sem: number) => {
  // Only run when you have detected your front is different
  // Double checking if the data exists
  if(doubleCheck) {
    axios.get(`/api/v2/mongo/years/one/${ownerID}/${year}/${sem}`,API.getAuthorization())
      .then(res => { if (res.status === 200) return; })
  }
  axios.post(`/api/v2/mongo/years`, {
    payload: { ownerID, year, sem }
  }, API.getAuthorization());
}

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

  const handleAddWords = async () => {
    // Checker
    if(isShowingExtra) {
      if(!parseInt(extraYear) || ! parseInt(extraSem)) return;
      if (2000 > parseInt(extraYear) || parseInt(extraYear) > 2022 ) return;
      if (parseInt(extraSem) < 1 || parseInt(extraSem) > 4) return;
    }
    // Handle the disapatch
    store.dispatch(offDialog());
    let payload : Word;
    if(isShowingExtra) {
      payload = (await axios.post(`/api/v2/mongo/words/extra`, {
        payload: {
          ownerID: user.ID, word, pronun, meaning, example, isPublic, language: languages.addWordLangPref
        },
        extra: {
          extraYear, extraSem
        }
    }, API.getAuthorization())).data.payload;
    } else {
      payload = (await axios.post(`/api/v2/mongo/words/default`, {payload: {
        ownerID: user.ID, word, pronun, meaning, example, isPublic,
      language: languages.addedWordsCount
      }}, API.getAuthorization())).data.payload;
    }
    // Let user know it has been successful add
    store.dispatch(setSnackbar(tr.successAddWord[ln]))

    // Sycn (Word)
    store.dispatch(addOneWordIntoData(payload))
    
    // Sync (Year)
    const found = years.find(year => year.year === payload.year && year.sem === payload.sem)
    if(!found) {
      store.dispatch(addYears({year: payload.year, sem: payload.sem}));
      syncYearsDB(true, user.ID, payload.year, payload.sem);
    };

    // Sync (languages) 
    await axios.put(`/api/v2/mongo/languages/${user.ID}`, 
    {payload: { addedWordsCount: languages.addedWordsCount + 1 }}, 
    API.getAuthorization());
    store.dispatch(incrementAddedWordsCount());
  }

  return (
    <div>
      {extraYear}
      <Dialog open={true} onClose={() => store.dispatch(offDialog())}>
        <DialogTitle id="form-dialog-title">{tr.title[ln]}</DialogTitle>
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
          <Button onClick={() => handleAddWords()} color="primary" variant="contained">
            {tr.btnOkay[ln]}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AddWordsDialog;