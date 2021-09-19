import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
// Tr
import * as tr from './drawer.tr.json'
import menuTr from '../components/menu/menu.tr.json';
import { State } from '../types';
import appbarTr from '../app/appbar.tr.json';
// MUI
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
// MUI Icons
import DashboardIcon from '@material-ui/icons/Dashboard';
import SettingsIcon from '@material-ui/icons/Settings';
import ReviewIcon from '@material-ui/icons/ImportContacts';
import ListIcon from '@material-ui/icons/FormatListBulleted';
import LoginButton from '@material-ui/icons/ExitToApp';
import VideogameAssetIcon from '@material-ui/icons/VideogameAsset';
import OkrIcon from '@material-ui/icons/MultilineChart';
// Redux
import store from '../redux/store';
import { useSelector } from 'react-redux';
// Redux action
import { setDialog, setPage } from '../redux/actions';

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
});

const DrawerComponent = (props: any) => {
  const classes = useStyles();
  const {isDrawerOpen, setDrawer} = props;
  const {language, user, support} = useSelector((state: State) => state);
  const ln = language;

  //
  const handleChangePage = (type: string) => {
    setDrawer(false);
    store.dispatch(setPage(type));

    // handle changing the hyperlink
    const path = window.location.pathname; // /okr/<userName>/accessToken
    if (path !== "/") document.location.href = "/";
  }

  const items = [
    {type:'dashboard', name: tr.dashboard[ln], icon: <DashboardIcon />},
    {type:'review', name: menuTr.reviewTitle[ln], icon: <ReviewIcon />},
    {type:'list', name: menuTr.listTitle[ln], icon: <ListIcon />},
    {type:'scrabbly', name: menuTr.scrabblyTitle[ln], icon: <VideogameAssetIcon />},
  ];

  const list = items.map(item => (
    <ListItem key={item.name} button onClick={() => handleChangePage(item.type)}>
      <ListItemIcon>{item.icon}</ListItemIcon>
      <ListItemText primary={item.name} />
    </ListItem>
  ))

  return (
    <div>
      <React.Fragment>
        <Drawer anchor='left' open={isDrawerOpen} onClose={() => setDrawer(false)}>
          {!user.isSignedIn
            ? <ListItem  button className={classes.list} onClick={() => store.dispatch(setDialog('LoginDialog'))}>
                <ListItemIcon><LoginButton /></ListItemIcon>
                <ListItemText primary={appbarTr.login[ln]} />
              </ListItem>
            : <ListItem  className={classes.list}>
                <ListItemText primary={user.firstName + tr.honor[ln]} />
              </ListItem>
          }
          
          <Divider />
            {list}
            {/* below is the OKR page, that does not use page of Redux*/}
            <ListItem button onClick={() => {document.location.href = "/okr"}}>
              <ListItemIcon >< OkrIcon /></ListItemIcon>
              <ListItemText primary={"OKR"} />
            </ListItem>
          <Divider />
          <ListItem button className={classes.list} onClick={() => store.dispatch(setDialog('SettingDialog'))}>
            <ListItemIcon><SettingsIcon /></ListItemIcon>
            <ListItemText primary={appbarTr.setting[ln]} />
          </ListItem>
          {/*
            This used to be served as admin only feature, but decided not to use.
            support.status === 'admin' &&
            (
              <ListItem button >
                <ListItemText style={{fontSize: 4}} primary={`Admin (Not visible)`} onClick={() => handleChangePage('admin')} />
              </ListItem>
            )
            */}
          <ListItem disabled >
            <ListItemText style={{ fontSize: 4 }} primary={`Beta ${support.version} (${support.versionDate})`} />
          </ListItem>
          <ListItem disabled >
            <Typography style={{ fontSize: 10}}>
              <i>{`Developed and maintained by AJ`}</i>
            </Typography>
          </ListItem>
          
        </Drawer>
      </React.Fragment>
    </div>
  );
};

export default DrawerComponent;