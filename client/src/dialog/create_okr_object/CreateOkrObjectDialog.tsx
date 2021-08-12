import React, { useState } from 'react';
// Type 
import { OkrObjectType } from '../../type/availableType';
import { CreateOkrObjectInput } from '../../type/payloadType';
// MUI
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
// Redux
import store from '../../redux/store';
// Redux Action
import { offDialog, setOkrReloadOn } from '../../redux/actions';
// Internal
import { throwEvent } from '../../frontendWambda';

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

const okrObjecTypeList: OkrObjectType[] = ["KeyResult", "Objective", "OkrDailyRoutine"];

const CreateOkrObject: React.FC = () => {
  const [title, setTitle] = useState("");
  const [selectedType, setType] = useState<OkrObjectType>("KeyResult");
  
  // handler
  const hdlCreateClick = () => {
    const userInput: CreateOkrObjectInput = { type: selectedType, title };
    throwEvent("okr:createOkrObject", userInput)
      .then(res => {
        if (res.serverResponse === "LogicallyDenied") {
          // nothing happens I think for now
        } else if (res.serverResponse === "Accepted") {
          store.dispatch(offDialog());
          store.dispatch(setOkrReloadOn());
        }
      })
  };

  const randerButtons = okrObjecTypeList.map(okrObjectType => (
    <Button 
      key={okrObjectType} 
      color={selectedType === okrObjectType ? "primary" : undefined}
      onClick={()=> setType(okrObjectType)}
      variant={selectedType === okrObjectType ? "contained" : undefined}
    >
      {okrObjectType}
    </Button>
  ))

  return (
    <div>
      <Dialog onClose={() => store.dispatch(offDialog())} aria-labelledby="customized-dialog-title" open={true}>
        <DialogTitle id="customized-dialog-title" onClose={() => store.dispatch(offDialog())}>
          Modal title
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            Please be aware that you cannot change type after creation.
          </Typography>
          <ButtonGroup size="small" aria-label="small outlined button group">
            { randerButtons }
          </ButtonGroup>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="content"
            autoComplete={"off"}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={() => hdlCreateClick()} color="primary">
            Save changes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default CreateOkrObject;