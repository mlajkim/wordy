import React from 'react';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
// Types
import { State } from '../../types';
// Main
import ShortcutContents from './ShortcutContents';
// tr
import trAppbar from '../../app/appbar.tr.json'
// Material UI Cores
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
// Material UI icons
import CloseIcon from '@material-ui/icons/Close';
// Redux
import store from '../../redux/store';
import { useSelector } from 'react-redux';
// Redux Actions
import { offDialog } from '../../redux/actions';

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

const DialogActions = withStyles((theme: Theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

const ShortcutDialog: React.FC = () => {
  // Redux states
  const { language } = useSelector((state: State) => state);
  const ln = language;

  return (
    <div>
      <Dialog onClose={() => {store.dispatch(offDialog())}} aria-labelledby="customized-dialog-title" open={true}>
        <DialogTitle id="customized-dialog-title" onClose={() => {store.dispatch(offDialog())}}>
          {trAppbar.shortcut[ln]}
        </DialogTitle>
        <DialogContent dividers>
          <ShortcutContents />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ShortcutDialog;