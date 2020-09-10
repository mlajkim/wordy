import React from 'react';

// import
import Button from '@material-ui/core/Button';
import GoogleSignOut from '../../components/signIn/GoogleSignOut';

export default function Welcome(props) {
  return (
    <div>
      <img src={require('./welcome.jpg')} alt="welcome"/>
      <h1>
        Welcome to Wordy! 
        You will be multi langualar easy, fast and for free

        Join and become the part of our community!
      </h1>
      <br />
      <h3> Click the button below and join right NOW!!</h3>

      <Button variant="contained" onClick={() => {props.setModal('SignInModal')}}>Sign in for more!</Button>
      <GoogleSignOut 
                isSignedIn={props.isSignedIn}
                setSignedIn={props.setSignedIn}
                profile={props.profile}
                setPage={props.setPage}
                setProfile={props.setProfile}
                setWords={props.setWords}
                setSnackbar={props.setSnackbar}/>
    </div>
  )
}