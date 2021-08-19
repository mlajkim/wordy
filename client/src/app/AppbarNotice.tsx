import React, { useState, useEffect } from 'react';
//Type
import { State } from '../types';
import trAppbar from './appbar.tr.json';
// import { throwEvent } from '../frontendWambda';
// MUI
import AppBar from '@material-ui/core/AppBar';
import { Button, Typography, Grid } from '@material-ui/core';
// Redux
// import store from '../redux/store';
import { useSelector } from 'react-redux';

const AppbarNotice: React.FC = () => {
  const { language } = useSelector((state: State) => state);
  const ln = language;

  // State
  const [ appbarNotice, setAppbarNotice ] = useState(false);

  useEffect(() => {
    // read the link
    
    // throw event based on it.
    // throwEvent("user:guestLogin", { guestLoginToken: "cmFiJ123SCxas152rgsqRRWJvdmoi" });

    // if it matches
    setAppbarNotice(false);
  }, []);

  return (
  <AppBar position="static" >
    {appbarNotice && 
      <Grid style={{ paddingLeft: 10, paddingTop: 3, backgroundColor: 'grey' }}>
        <Typography style={{ display: "inline-block" }}>
          {trAppbar.youAreCurrentlyLoggedInAsGuest[ln]}. {trAppbar.whoIsDeveloper[ln]}
        </Typography>
        <Button color="inherit" size="small" style={{ display: "inline-block" }} onClick={() => {}}>
          {trAppbar.details[ln]}
        </Button>
      </Grid>
    }
    </AppBar>
  )
};

export default AppbarNotice; 