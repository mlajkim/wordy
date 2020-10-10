import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
// Translation
import * as tr from './drawer.tr.json'
import menuTr from '../components/menu/menu.tr.json';
import {Language, UserState} from '../types';
import appbarTr from '../app/appbar.tr.json';
// Icons
import DashboardIcon from '@material-ui/icons/Dashboard';
import SettingsIcon from '@material-ui/icons/Settings';
import ReviewIcon from '@material-ui/icons/ImportContacts';
import ListIcon from '@material-ui/icons/FormatListBulleted';
import LoginButton from '@material-ui/icons/ExitToApp';
// Redux
import store from '../redux/store';
import {setDialog, setPage} from '../redux/actions';
import {useSelector} from 'react-redux';

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
  const {language, user} = useSelector((state: {language: Language, isSignedIn: boolean, user: UserState}) => state);
  const ln = language;

  //
  const handleChangePage = (type: string) => {
    setDrawer(false);
    store.dispatch(setPage(type));
  }

  const items = [
    {type:'dashboard', name: tr.dashboard[ln], icon: <DashboardIcon />},
    {type:'review', name: menuTr.reviewTitle[ln], icon: <ReviewIcon />},
    {type:'list', name: menuTr.listTitle[ln], icon: <ListIcon />}
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
          <Divider />
          <ListItem disabled button className={classes.list}>
            <ListItemIcon><SettingsIcon /></ListItemIcon>
            <ListItemText primary={appbarTr.setting[ln]} />
          </ListItem>
        </Drawer>
      </React.Fragment>
    </div>
  );
};

export default DrawerComponent;