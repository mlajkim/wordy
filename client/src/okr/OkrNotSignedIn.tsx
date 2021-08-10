import React, { Fragment } from 'react';
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
// tr
import tr from './okr_welcome.tr.json'
import trAppbar from '../app/appbar.tr.json';
// library
import {useSelector} from 'react-redux';
import store from '../redux/store';
// Redux Actions
import { setDialog } from '../redux/actions';

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

const OkrNotSignedIn: React.FC<{setOkrPage: any}> = ({ setOkrPage }) => {
  //Style
  const classes = useStyles();
  
  // Redux states
  const { language } = useSelector((state: State) => state);
  const ln = language;

  return (
    <Fragment>
      <h4>{tr.notSignedIn[ln]}</h4>
      <ThemeProvider theme={theme}>
        <Button variant="contained" color="primary" className={classes.margin} onClick={() => {store.dispatch(setDialog('LoginDialog'))}}>
          {trAppbar.login[ln]}
        </Button>
      </ThemeProvider>
    </Fragment>
  )
};

export default OkrNotSignedIn;
