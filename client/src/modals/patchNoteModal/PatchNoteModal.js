import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';


import AddCircleIcon from '@material-ui/icons/AddCircle';
import ArrowForwardOutlinedIcon from '@material-ui/icons/ArrowForwardOutlined';

// Patch List
import patch_list from '../../app/Patch';
import VERSION from '../../app/Version';


const styles = (theme) => ({
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

const DialogTitle = withStyles(styles)((props) => {
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

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

export default function PatchNoteModal(props) {
  // Always the latest in the index '0'
  let currentVersion = VERSION.version;

  let lateastPatch = patch_list.find(patch => patch.version === currentVersion);

  // handle contents
  let contents = lateastPatch.contents.map(content => {
    return (
      <Typography key={content.title} gutterBottom>
        <AddCircleIcon style={{ color: 'green' }}/> {content.title} <br />
        <ArrowForwardOutlinedIcon style={{ color: 'green' }} />{content.explain}
        <br />
      </Typography>
    );
  })

  return (
    <div>
      <Dialog maxWidth="sm" fullWidth onClose={() => {props.setModal('')}} aria-labelledby="customized-dialog-title" open={true}>
        <DialogTitle id="customized-dialog-title" onClose={() => {props.setModal('')}}>
          What's new on Wordy {lateastPatch.name} {lateastPatch.version}? ({lateastPatch.date})
        </DialogTitle>
        <DialogContent>
          {contents}
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={() => {props.setModal('')}} color="primary">
            ACKNOWLEDGE
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}