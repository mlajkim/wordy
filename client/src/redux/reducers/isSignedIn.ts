import * as actions from '../actionTypes';

const isSignedIn = (state = false, action: any) => {
  switch(action.type) {
    case actions.SET_IS_SIGNED_IN:
      return action.payload.toWhat;
      
    default:
      return state;
  }
}

export default isSignedIn;