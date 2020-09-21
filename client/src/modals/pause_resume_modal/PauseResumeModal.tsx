// eslint-disable-next-line
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

type Props = {
  modal: any;
  setModal: (arg0: any) => void;
  profile: any;
  setDataLoading: (arg0: boolean) => void;
  setSnackbar: (arg0: any) => void;
}

const PauseResumeModal: React.FC<Props> = ({
  modal,
  profile,
  setDataLoading,
  setModal,
  setSnackbar
}) => {

  const handlePauseResume = async () => {
    setDataLoading(true);
    const pause_or_resume = modal.data;
    setModal({}); // Close the modal

    // Get the user data first from database
    let endpoint = `/api/mongo/user/get/withID/${profile.UNIQUE_ID}`;
    const userRes = await (await fetch(endpoint)).json();

    // Get the transaction  
    endpoint = `/api/mongo/transaction/get/withID/${userRes.data.lastTransactionID}`;
    const transactionRes = await (await fetch(endpoint)).json();

    // Get the access token
    const accessTokenResponse = await (await fetch('/api/paypal/access_token/get')).json()
    
    // Pause or Resume the subscription
    endpoint = `/api/paypal/sub/type/${pause_or_resume}/with_subID_and_token/${transactionRes.data.subscriptionID}/${accessTokenResponse.data}`;
    const pause_subscription_response = await (await fetch(endpoint)).json();
    
    // Write the result
    setSnackbar({
      status: 'open',
      severity: pause_subscription_response.status,
      message: pause_subscription_response.message
    })
    setDataLoading(false);
  }

  return (
    <div>
      <Dialog onClose={() => {setModal({})}} aria-labelledby="customized-dialog-title" open={true}>
        <DialogTitle id="customized-dialog-title" onClose={() => {setModal({})}}>
          Pause / Resume?
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            Are you sure you would like to pause / resume your membership?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handlePauseResume} color="primary">
            OKAY
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default PauseResumeModal;