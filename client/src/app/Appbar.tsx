import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import tr from './appbar.tr.json'
import {state} from '../types';
// Style
import MUIStyle from '../styles/MUIStyle';
// Redux
import store from '../redux/store';
import {setDialog} from '../redux/actions';
import {useSelector} from 'react-redux';
// Icons
import MenuIcon from '@material-ui/icons/Menu';
import TranslateIcon from '@material-ui/icons/Translate';

const Appbar = () => {
  const classes = MUIStyle();
  const ln = useSelector((state: state) => state.language);

  return (
    <div className={classes.root}>
      <AppBar position="static" color="transparent">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Wordy
          </Typography>
          <IconButton className={"languageButton"} color="inherit" aria-label="language">
            <TranslateIcon />
          </IconButton>
          <Button color="inherit" onClick={() => store.dispatch(setDialog('LoginDialog'))}>{tr.login[ln]}</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Appbar;
