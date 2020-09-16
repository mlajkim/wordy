import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import VERSION from '../../app/Version';
import PayWithPaypal from '../../components/PayWithPaypal/PayWithPaypal';

export default function PayModal(props) {
  const userSelection = props.modal.data.userSelection;
  const priceAccordingToSelect = VERSION.price[userSelection];

  let body = (
    <PayWithPaypal amount={priceAccordingToSelect}
                  setModal={props.setModal}
                  profile={props.profile}
                  setProfile={props.setProfile}
                  setDataLoading={props.setDataLoading}/>
  );

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
            You will be charged {priceAccordingToSelect}
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