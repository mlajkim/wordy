import React from 'react';

// import
import GoogleSignIn from '../../components/signIn/GoogleSignIn';
import Button from '@material-ui/core/Button';

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

      <Button variant="contained" onClick={() => {props.setModal('SignInModal')}}>Login</Button>
    </div>
  )
}