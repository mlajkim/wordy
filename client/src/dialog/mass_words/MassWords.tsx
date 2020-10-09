import React from 'react';
import axios from 'axios';
import * as API from '../../API';
import { State } from '../../types';
// MUI
import IconButton from '@material-ui/core/IconButton';  
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
// icons
import SwitchBackToOneMode from '@material-ui/icons/AddBox';
// Redux
import store from '../../redux/store';
import {offDialog, setNewWordAddingType, setDialog } from '../../redux/actions';
import {useSelector} from 'react-redux';

const MassWords = () => {
  const {user} = useSelector((state: State) => state);

  const handleAddingStyleSwtich = () => {
    axios.put(`/api/v2/mongo/languages/${user.ID}`, {payload: {
      newWordAddingType: 'one'
    }}, API.getAuthorization())
    store.dispatch(setDialog('AddWordsDialog'));
    store.dispatch(setNewWordAddingType('one'));
  }

  return (
    <div>
      <Dialog
        open={true}
        onClose={() => store.dispatch(offDialog())}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Use Google's location service?"}
          <IconButton size='small' style={{display: 'block', float:'right',textAlign:'right'}} 
            onClick={() => handleAddingStyleSwtich()}>
            <SwitchBackToOneMode />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Let Google help apps determine location. This means sending anonymous location data to
            Google, even when no apps are running.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => store.dispatch(offDialog())} color="primary">
            Disagree
          </Button>
          <Button onClick={() => store.dispatch(offDialog())} color="primary" autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default MassWords;