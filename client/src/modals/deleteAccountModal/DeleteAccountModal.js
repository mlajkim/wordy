import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function DeleteAccountModal(props) {

  return (
    <div>
      <Dialog open={true} onClose={() => {props.setModal('')}} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To delete your account, write "delete my account" to proceed.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="owasdads"
            label="Email Address"
            type="email"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClose={() => {props.setModal('')}} color="primary">
            Cancel
          </Button>
          <Button onClose={() => {props.setModal('')}} color="secondary">
            DELETE
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}