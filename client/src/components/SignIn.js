import React, {Component} from 'react';

class SignIn extends Component {
  render(){
    return (
      <div>
        <div className="g-signin2" data-onsuccess="onSignIn"></div>

      </div>
    )
  }
}

export default SignIn;