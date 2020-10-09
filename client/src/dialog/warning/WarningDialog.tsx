import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
// translation
import tr from './warningDialog.tr.json';
// Redux
import store from '../../redux/store';
import {offDialog} from '../../redux/actions';
import {useSelector} from 'react-redux';
import { Language } from '../../types';

type Props = {status: '401' | '403'};

const WarningDialog = ({status}: Props) => {
  const ln = useSelector((state: {language: Language}) => state.language);

  return (
    <div>
      <Dialog
        open={true}
        onClose={() => store.dispatch(offDialog())}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {status === '401'
          ? <DialogTitle id="alert-dialog-title">{tr.t401.title[ln]}</DialogTitle>
          : <DialogTitle id="alert-dialog-title">{tr.t403.title[ln]}</DialogTitle>
        }
        
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {status === '401'
              ? tr.t401.desc[ln]
              : tr.t403.desc[ln]
            }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => store.dispatch(offDialog())} color="primary" autoFocus>
            {status === '401'
              ? tr.t401.okay[ln]
              : tr.t403.okay[ln]
            }
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default WarningDialog;