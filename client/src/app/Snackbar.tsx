import React from 'react';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { SnackbarState } from '../types';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
// Redux
import store from '../redux/store';
import {offSnackbar} from '../redux/actions';
import {useSelector} from 'react-redux';

const Alert = (props: AlertProps) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const RenderSnackbar = () => {
  const {snackbar} = useSelector((state: {snackbar: SnackbarState}) => state);

  const handleClose = (event: React.SyntheticEvent | React.MouseEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    store.dispatch(offSnackbar());
  };

  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center', }}
        open={snackbar.isOpen}
        autoHideDuration={snackbar.duration * 1000} // this takes milliseconds
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity={snackbar.type} style={{width: 300, marginTop: 75}}>
          {snackbar.desc}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default RenderSnackbar;