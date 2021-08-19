import React from 'react';
//Type
import { State } from '../types';
import trAppbar from './appbar.tr.json';
// MUI
import AppBar from '@material-ui/core/AppBar';
import { Button, Typography, Grid } from '@material-ui/core';
// Redux
import store from '../redux/store';
import { useSelector } from 'react-redux';

const AppbarNotice: React.FC = () => {
  const { language } = useSelector((state: State) => state);
  const ln = language;

  return (
  <AppBar position="static" >
      <Grid style={{ backgroundColor: 'grey' }}>
        <Typography style={{ display: "inline-block" }}>
          {trAppbar.youAreCurrentlyLoggedInAsGuest[ln]}. {trAppbar.whoIsDeveloper[ln]}
        </Typography>
        <Button color="inherit" size="small" style={{ display: "inline-block" }} >
          {trAppbar.details[ln]}
        </Button>
      </Grid>
    </AppBar>
  )
};

export default AppbarNotice; 