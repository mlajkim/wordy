import * as actions from '../actionTypes';

const page = (state = 'home', action: any) => {
  switch(action.type) {
    case actions.SET_PAGE:
      return action.payload.toWhat;
      
    default:
      return state;
  }
}

export default page;