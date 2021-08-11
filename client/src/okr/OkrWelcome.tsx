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
// library
import {useSelector} from 'react-redux';
import { throwEvent } from '../frontendWambda';

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

const OkrWelcome: React.FC<{ setOkrPage: any }> = ({ setOkrPage }) => {
  //Style
  const classes = useStyles();
  
  // Redux states
  const { language } = useSelector((state: State) => state);
  const ln = language;

  // handler
  const hdlWelcomeBtnClick = () => {
    setOkrPage("okrLoading");

    throwEvent("okr:createMyOkr")
      .then(() => setOkrPage('okrMode'));
  }

  return (
    <Fragment>
      <h4>{tr.welcome[ln]}</h4>
      <ThemeProvider theme={theme}>
        <Button variant="contained" color="primary" className={classes.margin}
          onClick={() => hdlWelcomeBtnClick()}  
        >
          {tr.welcomeButton[ln]}
        </Button>
      </ThemeProvider>
    </Fragment>
  )
};

export default OkrWelcome;
