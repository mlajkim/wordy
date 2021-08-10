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

  return (
    <Fragment>
      <h4>{tr.welcome[ln]}</h4>
      <ThemeProvider theme={theme}>
        <Button variant="contained" color="primary" className={classes.margin}>
          {tr.welcomeButton[ln]}
        </Button>
      </ThemeProvider>
    </Fragment>
  )
};

export default OkrWelcome;
