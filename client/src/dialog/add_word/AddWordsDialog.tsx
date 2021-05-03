import React, { useState } from 'react';
import { get_sem } from '../../utils';
import AvailableLangs from '../../components/available_langs/AvailableLangs';
// Material UI
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';  
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
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

  // Methods
  const handleSavingWords = () => {
    store.dispatch(offDialog());
    store.dispatch(setSnackbar(tr.successAddWord[ln]));
    const sem = get_sem();
    store.dispatch(postWords([{ word, pronun, meaning, example, isPublic: false, sem, tag: tags }]));
  } 

  return (
    <div>
      <Dialog open={true}>
        <DialogTitle id="form-dialog-title">
          <span>{tr.title[ln]}</span>
          <IconButton size='small' style={{display: 'block', float:'right',textAlign:'right'}} 
            onClick={() => store.dispatch(modifyNewWordAddingType('mass'))}>
            <AddToPhotosIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <AvailableLangs />
          <TextField margin="dense" id="word" label={tr.word[ln]} fullWidth value={word} onChange={(e) => setWord(e.target.value)}/>
          <TextField margin="dense" id="pronun" label={tr.pronun[ln]} fullWidth value={pronun} onChange={(e) => setPronun(e.target.value)}/>
          <TextField margin="dense" id="define" label={tr.meaning[ln]} fullWidth value={meaning} onChange={(e) => setMeaning(e.target.value)}/>
          <TextField margin="dense" id="example" label={tr.example[ln]} fullWidth value={example} onChange={(e) => setExample(e.target.value)}/>
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
    </div>
  );
}

export default AddWordsDialog;