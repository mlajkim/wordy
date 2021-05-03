import { UserState } from '../../types';
import { UPDATE_EVENT } from '../actions/eventAction';

const initialState: UserState = {
  isSignedIn: false
}

const eventReducer = (state = initialState, action: any) => {
  switch(action.type) {
    case UPDATE_EVENT:
      return action.payload;
      
    default:
      return state;
  }
}

export default eventReducer;