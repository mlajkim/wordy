import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import * as tr from './drawer.tr.json'
import {Language} from '../types';
// Icons
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
// Redux
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
  const ln = useSelector((state: {language: Language}) => state.language);

  return (
    <div>
      <React.Fragment>
        <Drawer anchor='left' open={isDrawerOpen} onClose={() => setDrawer(false)}>
          <ListItem disabled button className={classes.list}>
            <ListItemIcon><InboxIcon /></ListItemIcon>
            <ListItemText primary={tr.prep[ln]} />
          </ListItem>
          <Divider />
          <ListItem disabled button>
            <ListItemIcon><MailIcon /></ListItemIcon>
            <ListItemText primary=".." />
          </ListItem>
        </Drawer>
      </React.Fragment>
    </div>
  );
};

export default DrawerComponent;