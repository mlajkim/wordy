import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import ErrorOutlineOutlinedIcon from '@material-ui/icons/ErrorOutlineOutlined';

export default function DeleteAccountModal(props) {
  const consentMessage = "I understand the consequences, delete my account.";
  const label = "Type: " + consentMessage;
  const [userConsent, setUserConsent] = React.useState('');

   // the following deletes the account.
   const handleDeleteAccount = async () => {
     props.setModal({});

    if(!props.profile.isSignedIn) return;

    // Set the loading screen
    
    // Delete the database first

    // Sign out from Google as well.

    // 
  }

  let confirmButton;
  if(userConsent === consentMessage) {
    confirmButton = (
      <DialogActions>
        <Button onClick={() => {handleDeleteAccount()}} color="secondary">
          {consentMessage}
        </Button>
      </DialogActions>
    )
  }else{
    confirmButton = (
      <DialogActions>
        <Button color="secondary" disabled>
          {consentMessage}
        </Button>
      </DialogActions>
    )
  }
  
 

  return (
    
    <div>
      <Dialog open={true} onClose={() => {props.setModal('')}} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">
          <ErrorOutlineOutlinedIcon color="secondary" /> Are you absolutely sure?
          </DialogTitle>
        <DialogContent>
          <DialogContentText>
            This action cannot be undone. This will permanently delete any data related to your account. 
            This includes words data, your log, your preference, your language selections etc
          </DialogContentText>
          <DialogContentText>
            (Upcoming Feature) We will provide you getting the entire words data from you.
            Before delete the account, make sure if you have donwloaded your data. 
            If you want to downgrade, you can do so in your 
            Billing Settings.
          </DialogContentText>
          <DialogContentText>
            This will not change your billing plan. If you want to stop your subscription, 
            you can do so in your Settings.
            Please type "I understand the consequences, delete my account." to confirm.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="consent"
            label={label}
            fullWidth
            value={userConsent}
            onChange={(e) => {setUserConsent(e.target.value)}}
          />
        </DialogContent>
        {confirmButton}
      </Dialog>
    </div>
  );
}