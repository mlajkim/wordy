import React, { Fragment, useState } from 'react';
// Page
import OkrLoading from './OkrLoading';
// Types
import { State } from '../types';
// MUI
import Button from '@material-ui/core/Button';
import { green } from '@material-ui/core/colors';
import { createTheme,
  createStyles,
  makeStyles,
  Theme,
  ThemeProvider, } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle'
// tr
import tr from './okr_welcome.tr.json'
// library
import { throwEvent } from '../frontendWambda';
import { WordyEvent } from '../type/wordyEventType';
// redux
import store from '../redux/store';
import { useSelector } from 'react-redux';
// redux action
import { setSnackbar } from '../redux/actions';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      margin: {
        margin: theme.spacing(1),
      },
    }),
  );

  const theme = createTheme({
    palette: {
      primary: green,
    },
  });
const OkrWelcome: React.FC = () => {
  //Style
  const classes = useStyles();
  
  // Redux states
  const { language } = useSelector((state: State) => state);
  const ln = language;
  // State
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setLoading] = useState(false);

  // handler
  const hdlWelcomeBtnClick = () => {
    setLoading(true);

    throwEvent("okr:createMyOkr", input)
      .then((res: WordyEvent) => {
        if (res.serverResponse === "Accepted") {
          document.location.href = "/okr"
        } else if (res.serverResponse === "LogicallyDenied") {
          store.dispatch(setSnackbar("Too short or too long. Blank spaces outside of main words is also ignored", "warning"));
        }
      });
  }

  return (
    <Fragment>
      {isLoading && OkrLoading}
      <h4>{tr.welcome[ln]}</h4>
      <ThemeProvider theme={theme}>
        <Button variant="contained" color="primary" className={classes.margin}
          onClick={() => setOpen(true)}
        >
          {tr.welcomeButton[ln]}
        </Button>
      </ThemeProvider>
      <Dialog open={open} aria-labelledby="ask_nickname">
        <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Set your nickname
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="set your nickname"
            fullWidth
            onChange={(e) => setInput(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={() => hdlWelcomeBtnClick()} color="primary">
            Okay
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  )
};

export default OkrWelcome;
