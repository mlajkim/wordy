import React from 'react';
// type
import { Language } from '../../types';
// MUI
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import tr from './login_dialog.tr.json';
// Redux
import store from '../../redux/store';
import { useSelector } from 'react-redux';
// Redux action
import { offDialog } from '../../redux/actions';
// Components
import GoogleSignIn from '../../components/google_sign_in/GoogleSignIn';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
      padding: theme.spacing(2),
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  });

export interface DialogTitleProps extends WithStyles<typeof styles> {
  id: string;
  children: React.ReactNode;
  onClose: () => void;
}

const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

type Props = {
  type: 'login' | 'signup';
}

const LoginDialog = ({type}: Props) => {
  const ln = useSelector((state: {language: Language}) => state.language);

  const handleClose = () => {
    store.dispatch(offDialog());
  }
  return (
    <div >
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={true} fullWidth={true} maxWidth="sm" style={{textAlign: 'center'}}>
        <DialogTitle id="customized-dialog-title" onClose={handleClose} >
          {type === 'login' ? tr.title[ln] : tr.titleSignUp[ln]}
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            {type === 'login' ? tr.desc[ln] : tr.descSignUp[ln]}
          </Typography>
          {type === 'login' ? <GoogleSignIn type="login"/> : <GoogleSignIn type="signup"/>}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default LoginDialog;