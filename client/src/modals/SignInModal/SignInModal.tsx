import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
// Components
import GoogleSignIn from '../../components/sign_in/GoogleSignIn';
// Model
import {Props} from '../../model';

export default function SignInModal(props: Props) {
  let body = <GoogleSignIn {... props}/>;
  
  return (
    <div>
      <Dialog
        open={true}
        onClose={() => {props.setModal({type: '', data: null})}}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">로그인</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            구글 계정으로 Wordy에 로그인
          </DialogContentText>
          {body}
        </DialogContent>
        <DialogActions>
          <Button  onClick={() => {props.setModal({type: 'SignUpModal', data: null})}} color="primary">
            Wordy 계정 만들기
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}