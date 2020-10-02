import React, { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import tr from './appbar.tr.json'
import {Language} from '../types';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Drawer from './Drawer';
// Style
import MUIStyle from '../styles/MUIStyle';
// Redux
import store from '../redux/store';
import {setDialog, setLanguage} from '../redux/actions';
import {useSelector} from 'react-redux';
// Icons
import MenuIcon from '@material-ui/icons/Menu';
import TranslateIcon from '@material-ui/icons/Translate';

const Appbar = () => {
  const classes = MUIStyle();
  const ln = useSelector((state: {language: Language}) => state.language);

  const [isDrawerOpen, setDrawer] = React.useState(false); // Drawer
  const [menu, openMenu] = useState<null | HTMLElement>(null);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    openMenu(event.currentTarget);
  };
  
  const handleLanguageChange = (ln: Language) => {
    store.dispatch(setLanguage(ln))
    openMenu(null);
  }

  return (
    <div className={classes.root}>
      <AppBar position="static" color="transparent">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={() => setDrawer(true)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Wordy
          </Typography>
          <IconButton className={"languageButton"} color="inherit" aria-label="language" onClick={(e) => handleClick(e)}>
            <TranslateIcon />
          </IconButton>
          <Menu
            id="simple-menu"
            anchorEl={menu}
            keepMounted
            open={Boolean(menu)}
            onClose={() => openMenu(null)}
          >
            <MenuItem onClick={() => handleLanguageChange('ko')}>한국어</MenuItem>
            <MenuItem onClick={() => handleLanguageChange('en')}>English</MenuItem>
            <MenuItem disabled onClick={() => handleLanguageChange('en')}>中文 (简体)</MenuItem>
            <MenuItem disabled onClick={() => handleLanguageChange('en')}>日本語</MenuItem>
          </Menu>
          <Button color="inherit" onClick={() => store.dispatch(setDialog('LoginDialog'))}>{tr.login[ln]}</Button>
        </Toolbar>
      </AppBar>
      <Drawer isDrawerOpen={isDrawerOpen} setDrawer={setDrawer}/>
    </div>
  );
};

export default Appbar;
