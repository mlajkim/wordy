import * as actions from '../actionTypes';

const langauge = (state = 'kr', action: any) => {
  switch(action.type) {
    case actions.SET_LANGUAGE:
      return action.payload.toWhat;
      
    default:
      return state;
  }
}

export default langauge;