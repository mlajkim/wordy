import * as actions from '../actionTypes';

const years = (state = [], action: any) => {
  switch(action.type) {
    case actions.ADD_YEARS:
      return [...state, action.payload];
      
    default:
      return state; 
  }
}

export default years;