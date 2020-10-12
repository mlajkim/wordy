import { UserState } from '../../types';
import {UPDATE_USER} from '../actions/userAction';

const initialState: UserState = {
  isSignedIn: false
}

const user = (state = initialState, action: any) => {
  switch(action.type) {
    case UPDATE_USER:
      return action.payload;
      
    default:
      return state;
  }
}

export default user;