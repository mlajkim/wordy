import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
// Style
import MUIStyle from '../styles/MUIStyle';
// Redux
import store from '../redux/store';
import {setDialog} from '../redux/actions';
// Icons
import TranslateIcon from '@material-ui/icons/Translate';

const Appbar = () => {
  const classes = MUIStyle();

  return (
    <div className={classes.root}>
      <AppBar position="static">
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
          <Button color="inherit" onClick={() => store.dispatch(setDialog('LoginDialog'))}>JOIN TODAY</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Appbar;
