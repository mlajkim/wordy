import React, { Fragment, useEffect, useState } from 'react'
// Type
import { State } from '../../types'
import RELEASES from '../../releases'
// Translate
import tr from './patchNote.tr.json'
// Material UI core
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import MuiDialogContent from '@material-ui/core/DialogContent'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import Typography from '@material-ui/core/Typography';
import FormGroup from '@material-ui/core/FormGroup';
// Redux
import store from '../../redux/store';
import { useSelector } from 'react-redux';
// Redyx Action
import { offDialog } from '../../redux/actions';
import { modifySupport } from '../../redux/actions/supportAction';

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

const SettingDialog: React.FC = () => {
  // Redux states
  const { language, support } = useSelector((state: State) => state)
  const ln = language
  const [isUserNew, setUserNew] = useState(false)
  const [isUserLongTimeNoSee, setUserLongTimeNoSee] = useState(false)

  useEffect(() => {
    // ! Run once
    const idx = RELEASES.findIndex(release => release.version === support.lastReadVersion)
    if (idx === -1) setUserNew(true)
    else if (idx >= 2) setUserLongTimeNoSee(true)
  }, [support.lastReadVersion])

  return (
    <div>
      <Dialog onClose={() => store.dispatch(offDialog())} aria-labelledby="customized-dialog-title" open maxWidth="xs" fullWidth>
        <DialogTitle id="customized-dialog-title" onClose={() => store.dispatch(offDialog())}>
          {tr.welcome[ln]}
          {
            isUserNew ?
            (
              <Fragment>
                <Typography color="textSecondary" style={{ fontSize: 13, paddingTop: 5 }}>
                  Welcome to wordy! you will be multilanguar soon!
                </Typography>
              </Fragment>
            )
            : (
              <Fragment>
                  <Typography color="textSecondary" style={{ fontSize: 13, paddingTop: 5 }}>
                    {isUserLongTimeNoSee ? "hi" : tr.welcomeBackToWordyCloud[ln]}
                  </Typography>
                  <Typography gutterBottom color="textSecondary" style={{ fontSize: 13 }}>
                    {tr.hereIsTheReleaseNoteFront[ln] + support.version + tr.hereIsTheReleaseNoteBack[ln]}
                  </Typography>
              </Fragment>
            )
          }
          
        </DialogTitle>
        <DialogContent dividers >
          <FormGroup>
            <Typography gutterBottom color="primary" style={{ fontSize: 15 }}>
              hi
            </Typography>
          </FormGroup>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SettingDialog;