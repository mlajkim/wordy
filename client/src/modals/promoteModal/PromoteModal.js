import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import PromoteBox from './PromoteBox';
 

export default function PromoteModal(props) {

  return (
    <React.Fragment>
      <Dialog
        fullWidth
        maxWidth="xl"
        open={true}
        onClose={() => props.setModal('')}
        aria-labelledby="max-width-dialog-title"
      >
        <DialogTitle id="max-width-dialog-title">UPGRADE TO PRO</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Join Today to our Wordy Community and Become the "Multiangular" Tomorrow!
          </DialogContentText>
          <PromoteBox type="free" profile={props.profile}
                                  setModal={props.setModal}/>
          <PromoteBox type="monthly" profile={props.profile}
                                    setModal={props.setModal}/>
          <PromoteBox type="yearly" profile={props.profile}
                                  setModal={props.setModal}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => props.setModal('')} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}