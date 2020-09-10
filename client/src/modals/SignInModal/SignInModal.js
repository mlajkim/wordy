import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import GoogleSignIn from '../../components/signIn/GoogleSignIn';

export default function SignInModal(props) {
  let body = <GoogleSignIn 
                isSignedIn={props.isSignedIn}
                setSignedIn={props.setSignedIn}
                setWords={props.setWords}
                setProfile={props.setProfile}
                setDataLoading={props.setDataLoading}
                setPage={props.setPage}
                setModal={props.setModal}
                setSnackbar={props.setSnackbar}/>;
  return (
    <div>
      <Dialog
        open={true}
        onClose={() => {props.setModal('')}}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Sign in</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            The safetest way to signin through the federal idenity providers
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