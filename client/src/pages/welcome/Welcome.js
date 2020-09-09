import React from 'react';

// import
import GoogleSignIn from '../../components/signIn/GoogleSignIn';

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

      <GoogleSignIn isSignedIn={props.isSignedIn}
                    setSignedIn={props.setSignedIn}
                    setWords={props.setWords}
                    setProfile={props.setProfile}
                    setDataLoading={props.setDataLoading}
                    setPage={props.setPage}/>
    </div>
  )
}