import * as actions from '../actionTypes';

const DEFAULT_SEVRITY_TYPE = 'success';
const DEFAULT_DURATION_SECS = 2; // seconds
const DEFAULT_WARNING_DURATION_SECS = 5; // seconds

const initialState = {
  isOpen: false
}

const snackbar = (state = initialState, action: any) => {
  // Commented on Aug 11, 2021
  // if warning or erorr, 5 seconds. info and okay will be 2 seconds
  // again, if time is specfied, default data is ignored
  let defaultLength = DEFAULT_DURATION_SECS;
  if (typeof action.payload !== 'undefined') {
    defaultLength = action.payload.type === 'warning' || 'error' 
    ? DEFAULT_WARNING_DURATION_SECS 
    : DEFAULT_DURATION_SECS;
  };
  
  switch(action.type) {
    case actions.SET_SNACKBAR:
      return {
        isOpen: true,
        desc: action.payload.desc,
        type: action.payload.type ? action.payload.type : DEFAULT_SEVRITY_TYPE,
        duration: action.payload.duration ? action.payload.duration : defaultLength,
      };
    
    case actions.OFF_SNACKBAR:
      return initialState

    default:
      return state;
  }
}

export default snackbar;