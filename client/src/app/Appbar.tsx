import React, { useState } from 'react';
import {useGoogleLogout} from 'react-google-login'
import Cookie from 'js-cookie';
// Material UI
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import tr from './appbar.tr.json'
import {Language} from '../types';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Drawer from './Drawer';
import Avatar from '@material-ui/core/Avatar';
import * as API from '../API'; 
// Style
import MUIStyle from '../styles/MUIStyle';
// Redux
import store from '../redux/store';
import {setSignedIn, setDialog, setLanguage, setPage, setUser} from '../redux/actions';
import {useSelector} from 'react-redux';
// Icons
import MenuIcon from '@material-ui/icons/Menu';
import TranslateIcon from '@material-ui/icons/Translate';
import AddIcon from '@material-ui/icons/Add';
// Credetnial
import {GOOGLE_CLIENT_ID} from '../credential';

const Appbar = () => {
  const classes = MUIStyle();
  const {language, isSignedIn, user} = useSelector((state: {language: Language, isSignedIn: boolean, user:any}) => state);
  const ln = language;
  const [isDrawerOpen, setDrawer] = React.useState(false); // Drawer

  // @languge menu
  const [menu, openMenu] = useState<null | HTMLElement>(null);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    openMenu(event.currentTarget);
  };

  const handleLanguageChange = (ln: Language) => {
    store.dispatch(setLanguage(ln));
    const accessToken = Cookie.get('login');
    const payload = {languagePreference: ln};
    API.handleUserChangeDB(accessToken as string, payload);
    openMenu(null);
  }

  

  // @profile image menu
  const [profileMenu, setProfileMenu] = useState<null | HTMLElement>(null);
  const handleProfileMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setProfileMenu(event.currentTarget);
  };

  const handleLogin = () => {
    setProfileMenu(null);
    store.dispatch(setDialog('LoginDialog'));
  }

  const handleLogout = () => {
    setProfileMenu(null);
    store.dispatch(setUser('', '', '', ''));
    store.dispatch(setSignedIn(false));
    store.dispatch(setDialog(''));
    store.dispatch(setPage('home'));
    signOut();
  };

  const { signOut } = useGoogleLogout({
    onFailure: () => null,
    clientId: GOOGLE_CLIENT_ID,
    onLogoutSuccess: handleLogout
  })
  
  return (
    <div className={classes.root}>
      <AppBar position="static" color="transparent">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={() => setDrawer(true)}>
            <MenuIcon />
          </IconButton>
          <Typography onClick={() => {store.dispatch(setPage('dashboard'))}} variant="h6" className={classes.title}>
            Wordy
          </Typography>
          {isSignedIn &&
            <IconButton className={"addWordsButton"} color="inherit" aria-label="add-languages" onClick={() => store.dispatch(setDialog('AddWordsDialog'))}>
              <AddIcon fontSize="small" />
            </IconButton>
          }
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
            <MenuItem onClick={() => handleLanguageChange('ja')}>日本語</MenuItem>
            <MenuItem disabled onClick={() => handleLanguageChange('en')}>中文 (简体)</MenuItem>
          </Menu>
          <IconButton size="small" color="inherit" onClick={(e) => handleProfileMenu(e)}>
            <Avatar alt={user.firstName} src={user.imageUrl} />
          </IconButton>
          <Menu
            id="loginMenu"
            anchorEl={profileMenu}
            keepMounted
            open={Boolean(profileMenu)}
            onClose={() => setProfileMenu(null)}
          >
            {isSignedIn && <MenuItem disabled onClick={() => setProfileMenu(null)}>{tr.setting[ln]}</MenuItem>}
            {!isSignedIn && <MenuItem onClick={() => handleLogin()}>{tr.login[ln]}</MenuItem>}
            {isSignedIn && <MenuItem onClick={() => handleLogout()}>{tr.logout[ln]}</MenuItem>}
          </Menu>
        </Toolbar>
      </AppBar>
      <Drawer isDrawerOpen={isDrawerOpen} setDrawer={setDrawer}/>
    </div>
  );
};

export default Appbar;
