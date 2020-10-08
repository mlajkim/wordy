import * as actions from '../actionTypes';

const initialState = {
  isOpen: false
}

const snackbar = (state = initialState, action: any) => {
  switch(action.type) {
    case actions.SET_SNACKBAR:
      return {
        isOpen: true,
        desc: action.payload.desc,
        type: action.payload.type ? action.payload.type : null,
        duration: action.payload.duration ? action.payload.duration : null,
      };
    
    case actions.OFF_SNACKBAR:
      return initialState
      
    default:
      return state;
  }
}

export default snackbar;