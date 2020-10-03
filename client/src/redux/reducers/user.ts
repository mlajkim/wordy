import * as actions from '../actionTypes';

const user = (state = {}, action: any) => {
  switch(action.type) {
    case actions.SET_USER:
      return {...action.payload};
      
    default:
      return state;
  }
}

export default user;