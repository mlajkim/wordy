import React from 'react';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';

// import credential

interface Props {
  setModal: (arg0: any) => void;
  profile: any;
}

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

export default function PauseResumeModal (props: Props) {
  const handlePauseResume = async () => {
    props.setModal({});

    const transRes = await fetch(`/api/mongo/transaction/get/${props.profile.UNIQUE_ID}`, {
      method: 'GET',
      headers: {'Content-Type':'application/json'}
    })

    // Fetch from the Paypal server
    const url = `https://api.sandbox.paypal.com/v1/billing/subscriptions/`;
    const newUserRes = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' // + transRes.accessToken
      },
     // body: {reason: "Customer-requested pause"}
    }).then(res => res.json())
  }

  return (
    <div>
      <Dialog onClose={() => {props.setModal({})}} aria-labelledby="customized-dialog-title" open={true}>
        <DialogTitle id="customized-dialog-title" onClose={() => {props.setModal({})}}>
          Pause / Resume?
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            Are you sure you would like to pause / resume your membership?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={() => {handlePauseResume()}} color="primary">
            OKAY
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}