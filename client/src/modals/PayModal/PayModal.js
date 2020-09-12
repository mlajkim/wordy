import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import VERSION from '../../app/Version';

export default function PayModal(props) {
  let body = null;

  const userSelection = props.modal.data.userSelection;

  return (
    <div>
      <Dialog
        open={true}
        onClose={() => {props.setModal('')}}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Secured Payment</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            The most secured way to pay directly through the trusted provider.
          </DialogContentText>
          <DialogContentText id="alert-dialog-description">
            You will be charged {VERSION.price[userSelection]}
          </DialogContentText>
          {body}
        </DialogContent>
        <DialogActions>
          <Button  onClick={() => {props.setModal('')}} color="primary" autoFocus>
            Go back
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}