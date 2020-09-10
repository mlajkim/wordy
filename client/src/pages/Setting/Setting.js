import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';

import GoogleSignOut from'../../components/signIn/GoogleSignOut';

/**
 * 
 * typeOfLogIn: String,
  federalId: String, // Google's googleId;
  email: String,
  familyName: String,
  givenName: String,
  profileImgUrl: String,
  subscription: String,
  joinedDate: String,
  lastUsed: String
 */

export default function Setting(props) {
  let items = ['email','familyName','givenName'];
  let displayItems = items.map(item => {
    return (
      <TextField
          key={item}
          label={item}
          defaultValue={props.profile[item]}
          className="hi"
          helperText="Some important text"
          margin="dense"
          variant="outlined"
          fullWidth
        />
    )
  })
  return (
    <div>
      <h1>
        Welcome to setting!
      </h1>
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="md">
        <GoogleSignOut 
                isSignedIn={props.isSignedIn}
                setSignedIn={props.setSignedIn}
                profile={props.profile}
                setPage={props.setPage}
                setProfile={props.setProfile}
                setWords={props.setWords}
                setSnackbar={props.setSnackbar}/>
        {displayItems}
      </Container>
    </React.Fragment>

    </div>
  );
}