import * as actions from '../actionTypes';

const DEFAULT_SEVRITY_TYPE = 'success';
const DEFAULT_DURATION_SECS = 2; // seconds

const initialState = {
  isOpen: false
}

const snackbar = (state = initialState, action: any) => {  
  switch(action.type) {
    case actions.SET_SNACKBAR:
      return {
        isOpen: true,
        desc: action.payload.desc,
        type: action.payload.type ? action.payload.type : DEFAULT_SEVRITY_TYPE,
        duration: action.payload.duration ? action.payload.duration : DEFAULT_DURATION_SECS,
      };
    
    case actions.OFF_SNACKBAR:
      return initialState

    default:
      return state;
  }
}

export default snackbar;