import React, { useState, useLayoutEffect, Fragment, FC } from 'react';
import { useGoogleLogout } from 'react-google-login'
import Cookie from 'js-cookie';
// Type
import { languageCodeIntoUserFriendlyFormat } from '../type/sharedWambda';
import { appbarLight, appbarDark, appbarDevMode } from '../theme';
import Menu from '@material-ui/core/Menu';
import { GOOGLE_CLIENT_ID } from '../type/predefined';
// Lambda
import { throwEvent } from '../frontendWambda';
// Component
import SearchBar from '../components/search_bar/SearchBar';
// MUI
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import tr from './appbar.tr.json'
import { State, Language } from '../types';
import MenuItem from '@material-ui/core/MenuItem';
import Drawer from './Drawer';
import Avatar from '@material-ui/core/Avatar';
import * as API from '../API';
import Tooltip from '@material-ui/core/Tooltip';
// MUI Icons
import MenuIcon from '@material-ui/icons/Menu';
import TranslateIcon from '@material-ui/icons/Translate';
import AddIcon from '@material-ui/icons/Add';
import LightModeIcon from '@material-ui/icons/WbSunny'; // Light mode On
import DarkModeIcon from '@material-ui/icons/Brightness2'; // Dark mode On
// Style
import MUIStyle from '../styles/MUIStyle';
// Redux
import store from '../redux/store';
import { useSelector } from 'react-redux';
// Redux Actions
import { 
  setDialog, setLanguage, setPage, offDialog, setSnackbar, setOkrReloadOn 
} from '../redux/actions';
import { getSupport,switchDarkLightMode } from '../redux/actions/supportAction';
import { updateUser } from '../redux/actions/userAction';


const Appbar: FC = () => {
  const classes = MUIStyle();
  const {language, user, support} = useSelector((state: State) => state);
  const ln = language;
  const [isDrawerOpen, setDrawer] = React.useState(false); // Drawer

  // @languge menu
  const [menu, openMenu] = useState<null | HTMLElement>(null);
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);


  // Get window size and apply, so that some of the functions may work!
  useLayoutEffect(() => {
    const resize = () => setInnerWidth(window.innerWidth);
    window.addEventListener('resize', resize);
  }, []);

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

  // hdlSettingClick
  const hdlSettingClick = () => {
    setProfileMenu(null);
    store.dispatch(setDialog("SettingDialog"));
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
    // Commented on Aug 14
    throwEvent("wss:signOut")
      .then(() => store.dispatch(setOkrReloadOn()));

    API.killCookie('login');
    setProfileMenu(null);
    store.dispatch(updateUser({ isSignedIn: false }));
    store.dispatch(offDialog());
    store.dispatch(setPage('home'));
    signOut(); // Testing
  };

  const { signOut } = useGoogleLogout({
    onLogoutSuccess: () => { /*Blank*/ },
    onFailure: () => {store.dispatch(setSnackbar('[ERROR] Logout failure', 'warning'))},
    clientId: GOOGLE_CLIENT_ID
  });
  
  return (
    <div className={classes.root}>
      <AppBar position="static" color="transparent" style={{ background: support.isBeta ? appbarDevMode : support.isDarkMode ? appbarDark : appbarLight }}>
        <Toolbar>
          {!support.extendedSearchBar
             && (
               <Fragment>
                  <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={() => setDrawer(true)}>
                    <MenuIcon />
                  </IconButton>
                  <Typography 
                    onClick={() => {store.dispatch(setPage('dashboard'))}} 
                    variant="h6" 
                    className={classes.title} 
                  >
                    {`Wordy ${innerWidth > 520 ? support.version : ""}`}
                  </Typography>
                </Fragment>
             )
          }
          { user.isSignedIn && <SearchBar /> }
          {user.isSignedIn && 
            <IconButton className={"addWordsButton"} color="inherit" aria-label="add-languages"
              onClick={() => handleAddWordClick()}>
              <AddIcon fontSize="small" />
            </IconButton>
          }
          {
            innerWidth > 500 &&
            <Fragment>
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
            </Fragment>
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
            {user.isSignedIn && <MenuItem onClick={() => hdlSettingClick()}>{tr.setting[ln]}</MenuItem>}
            {user.isSignedIn && <MenuItem onClick={() => store.dispatch(setDialog("ShortcutDialog"))}>{tr.shortcut[ln]}</MenuItem>}
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
