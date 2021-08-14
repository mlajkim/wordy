import React, { Fragment } from 'react';
// MUI
import Button from '@material-ui/core/Button';
import { Grid } from '@material-ui/core';

const NotFound: React.FC = () => {
  const path = window.location.pathname;
  const pathArr = path.split("/"); // ["", "okr", "csuserName", "tempAccessToken"]
  const pathData = {
    userLink: pathArr.length > 2 ? pathArr[2] : "",
    tempAccessToken: pathArr.length > 3 ? pathArr[3]: ""
  };

  return (
    <Fragment>
      <Grid style={{ marginTop: 25, marginBottom: 25 }}>
        {`User '${pathData.userLink}' is either not available or is private`}
      </Grid>
      <Button color="primary" variant="contained"  onClick={() => document.location.href = "/okr"}>Go to my page</Button>
    </Fragment>
  )
};

export default NotFound;