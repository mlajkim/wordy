import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
// Translation
import {Language} from '../../types';
// Redux
import store from '../../redux/store';
import {setDialog} from '../../redux/actions';
import {useSelector} from 'react-redux';

const AddWordsDialog = () => {
  const {language} = useSelector((state: {language: Language}) => state);
  const ln = language;

  return (
    <div>
      <Dialog open={true} onClose={() => store.dispatch(setDialog(''))}>
        <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To subscribe to this website, please enter your email address here. We will send updates
            occasionally.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => store.dispatch(setDialog(''))} color="primary">
            Cancel
          </Button>
          <Button onClick={() => store.dispatch(setDialog(''))} color="primary">
            Subscribe
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AddWordsDialog;