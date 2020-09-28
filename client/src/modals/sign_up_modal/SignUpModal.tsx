// blah b;ah
import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
// Components
import GoogleSignUp from '../../components/sign_in/GoogleSignUp';
// Model
import {Props} from '../../model';

const SignUpModal = (props: Props) => {  
  return (
    <div>
      <Dialog
        open={true}
        onClose={() => {props.setModal({type: '', data: null})}}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Wordy 계정 만들기</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            구글 계정으로 Wordy에 쉽게 가입하세요!
          </DialogContentText>
          <GoogleSignUp {... props}/>
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

export default SignUpModal;