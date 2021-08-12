import * as actions from '../actionTypes';

// initial state, as loading is false
const initialState = false;

const okrLoading = (state = initialState, action: any) => {  
  switch(action.type) {
    case actions.SET_OKR_RELOAD_ON:
      return true;
    
    case actions.SET_OKR_RELOAD_OFF:
      return initialState

    default:
      return state;
  }
}

export default okrLoading;