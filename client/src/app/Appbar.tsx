import React, { useState } from 'react';
import {useGoogleLogout} from 'react-google-login'
import Cookie from 'js-cookie';
// shared import
import { languageCodeIntoUserFriendlyFormat } from '../type/sharedWambda';
// Theme
import { appbarLight, appbarDark } from '../theme';
// Material UI
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import tr from './appbar.tr.json'
import { State, Language } from '../types';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Drawer from './Drawer';
import Avatar from '@material-ui/core/Avatar';
import * as API from '../API';
import Tooltip from '@material-ui/core/Tooltip';
// Style
import MUIStyle from '../styles/MUIStyle';
// Redux
import store from '../redux/store';
import { useSelector } from 'react-redux';
// Redux Actions
import {setDialog, setLanguage, setPage, offDialog, setSnackbar} from '../redux/actions';
import { getSupport,switchDarkLightMode } from '../redux/actions/supportAction';
import { updateUser } from '../redux/actions/userAction';
// Icons
import MenuIcon from '@material-ui/icons/Menu';
import TranslateIcon from '@material-ui/icons/Translate';
import AddIcon from '@material-ui/icons/Add';
import LightModeIcon from '@material-ui/icons/WbSunny'; // Light mode On
import DarkModeIcon from '@material-ui/icons/Brightness2'; // Dark mode On
// Credetnial
import { GOOGLE_CLIENT_ID } from '../credential';

const Appbar = () => {
  const classes = MUIStyle();
  const {language, user, support} = useSelector((state: State) => state);
  const ln = language;
  const [isDrawerOpen, setDrawer] = React.useState(false); // Drawer

  // @languge menu
  const [menu, openMenu] = useState<null | HTMLElement>(null);
  // Methods
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    openMenu(event.currentTarget);
  };
  // Method
  const handleAddWordClick = () => {
    store.dispatch(getSupport())
    if (support.newWordAddingType === 'one') store.dispatch(setDialog('AddWordsDialog'));
    else store.dispatch(setDialog('MassWordsDialog'));
  };

  const handleLanguageChange = (ln: Language) => {
    store.dispatch(setSnackbar(tr.languageChanged[ln]))
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

  // @ LOGOUT FUNCTIONS
  const handleLogout = () => {
    API.killCookie('login');
    setProfileMenu(null);
    store.dispatch(updateUser({ isSignedIn: false }));
    store.dispatch(offDialog());
    store.dispatch(setPage('home'));
    // signOut(); // Testing
  };

  const { signOut } = useGoogleLogout({
    onLogoutSuccess: () => { /*Blank*/ },
    onFailure: () => {store.dispatch(setSnackbar('[ERROR] Logout failure', 'warning'))},
    clientId: GOOGLE_CLIENT_ID
  });
  
  return (
    <div className={classes.root}>
      <AppBar position="static" color="transparent" style={{ background: support.isDarkMode ? appbarDark : appbarLight }}>
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={() => setDrawer(true)}>
            <MenuIcon />
          </IconButton>
          <Typography onClick={() => {store.dispatch(setPage('dashboard'))}} variant="h6" className={classes.title}>
            {`Wordy ${support.version}`} 
          </Typography>
          {user.isSignedIn &&
            <IconButton className={"addWordsButton"} color="inherit" aria-label="add-languages" 
              onClick={() => handleAddWordClick()}>
              <AddIcon fontSize="small" />
            </IconButton>
          }
          <IconButton className={"ChangeDarkLightMode"} color="inherit" aria-label="darkmode" onClick={() => store.dispatch(switchDarkLightMode())}>
            {support.isDarkMode 
              ? <Tooltip title={tr.toLightMode[ln]} placement="bottom">
                  <LightModeIcon fontSize="small" />
                </Tooltip> 
              : <Tooltip title={tr.toDarkMode[ln]} placement="bottom">
                  <DarkModeIcon fontSize="small" /> 
                </Tooltip>
            }
          </IconButton>
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
            <MenuItem onClick={() => handleLanguageChange('ko')}>{languageCodeIntoUserFriendlyFormat('ko')}</MenuItem>
            <MenuItem onClick={() => handleLanguageChange('en')}>{languageCodeIntoUserFriendlyFormat('en')}</MenuItem>
            <MenuItem onClick={() => handleLanguageChange('ja')}>{languageCodeIntoUserFriendlyFormat('ja')}</MenuItem>
            <MenuItem disabled onClick={() => handleLanguageChange('en')}>{languageCodeIntoUserFriendlyFormat('zh')}</MenuItem>
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
            {user.isSignedIn && <MenuItem disabled onClick={() => setProfileMenu(null)}>{tr.setting[ln]}</MenuItem>}
            {!user.isSignedIn && <MenuItem onClick={() => handleLogin()}>{tr.login[ln]}</MenuItem>}
            {user.isSignedIn && <MenuItem onClick={() => handleLogout()}>{tr.logout[ln]}</MenuItem>}
          </Menu>
        </Toolbar>
      </AppBar>
      <Drawer isDrawerOpen={isDrawerOpen} setDrawer={setDrawer}/>
    </div>
  );
};

export default Appbar;
