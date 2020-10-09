import * as actions from '../actionTypes';

const initialState = {
  isOpen: false
}

const dialog = (state = initialState, action: any) => {
  switch(action.type) {
    case actions.OFF_DIALOG:
      return initialState;

    case actions.SET_DIALOG:
      return {
        isOpen: true,
        type: action.payload.type,
        payload: action.payload.payload ? action.payload.payload : null
      };
      
    default:
      return state;
  }
}

export default dialog;