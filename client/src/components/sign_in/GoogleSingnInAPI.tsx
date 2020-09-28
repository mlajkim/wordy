import VERSION from '../../app/Version';
// model
import {Props} from '../../model';

export const handle_existing_user = async (props: Props , user: any) => {
  // Show the patchnote
  if (parseFloat (user.readPatch) < parseFloat(VERSION.version)) {
    props.setModal({type: 'PatchNoteModal', data: null});
    // make sure to save the fact that the user has read.
    fetch(`/api/mongo/user/${user._id}/one/readPatch`, {
      method: 'PUT',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        value: VERSION.version
      })
    });
  }

  // bring words collection from database
  let url = `/api/mongo/word/${user._id}`;
  const resWords = await (await fetch(url, {
    method: 'GET',
    headers: {'Content-Type':'application/json'}
  })).json()
  if(resWords.status === 'success') props.setWords(resWords.data);

  return {
    UNIQUE_ID: user._id,
    userInfo: user,
  }
}

export const handle_new_user = async (props: Props, googleResponse: any) => {
  // New user reads patch note
  props.setModal({type: 'PatchNoteModal', data: null});

  // Add the new user
  let url = `/api/mongo/user/post`;
  let option = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      typeOfLogIn: 'google',
      federalId: googleResponse.googleId, 
      email: googleResponse.email,
      familyName: googleResponse.familyName,
      givenName: googleResponse.givenName,
      readPatch: VERSION.version,
      profileImgUrl: googleResponse.imageUrl,
      subscription: ''
    })
  }
  const newUser = await (await fetch(url, option)).json();

  return {
    UNIQUE_ID: newUser._id,
    userInfo: newUser,
  }
}

export const handle_signin_error = (props: Props, googleResponse: any) => {
  props.setModal({type: '', data: null });
  props.setSnackbar({
    status: 'open',
    message: `Sign-in Fail: ${googleResponse.details}`,
    severity: 'error'
  })
}
