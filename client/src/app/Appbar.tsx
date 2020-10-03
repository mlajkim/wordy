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
import Avatar from '@material-ui/core/Avatar';
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

  // @languge menu
  const [menu, openMenu] = useState<null | HTMLElement>(null);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    openMenu(event.currentTarget);
  };

  const handleLanguageChange = (ln: Language) => {
    store.dispatch(setLanguage(ln))
    openMenu(null);
  }

  // @profile image menu
  const [profileMenu, setProfileMenu] = useState<null | HTMLElement>(null);
  const handleProfileMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setProfileMenu(event.currentTarget);
  };
  
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
            <TranslateIcon fontSize="small" />
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
          <IconButton size="small" color="inherit" onClick={(e) => handleProfileMenu(e)}>
            <Avatar alt="" src="/static/images/avatar/1.jpg" />
          </IconButton>
          <Menu
            id="loginMenu"
            anchorEl={profileMenu}
            keepMounted
            open={Boolean(profileMenu)}
            onClose={() => setProfileMenu(null)}
          >
            <MenuItem onClick={() => setProfileMenu(null)}>{tr.setting[ln]}</MenuItem>
            <MenuItem onClick={() => setProfileMenu(null)}>{tr.login[ln]}</MenuItem>
            <MenuItem onClick={() => setProfileMenu(null)}>{tr.logout[ln]}</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Drawer isDrawerOpen={isDrawerOpen} setDrawer={setDrawer}/>
    </div>
  );
};

export default Appbar;
