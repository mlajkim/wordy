import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import PromoteBox from './PromoteBox';
 

export default function PromoteModal(props) {
  // default value of hideFree 
  const hideFree = props.hideFree ? true : false;

  // handle Free Promote.
  let freePromoteBox;
  if(hideFree) freePromoteBox = <PromoteBox type="free" profile={props.profile}
                                            setModal={props.setModal}/>;
  else freePromoteBox = null;

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
          {freePromoteBox}
          <PromoteBox type="monthly" profile={props.profile}
                                    setModal={props.setModal}/>
          <PromoteBox type="yearly" profile={props.profile}
                                  setModal={props.setModal}/>
        </DialogContent>
        <DialogActions>
          {!hideFree && 
          <Button onClick={() => props.setModal('')} color="primary">
            Maybe Later
          </Button>
          }
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}