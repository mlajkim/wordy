import * as actions from '../actionTypes';

const languages = (state = [], action: any) => {
  switch(action.type) {
    case actions.SET_LANGUAGES:
      return action.payload.toWhat;
      
    default:
      return state;
  }
}

export default languages;