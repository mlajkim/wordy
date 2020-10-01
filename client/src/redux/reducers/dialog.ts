import * as actions from '../actionTypes';

const dialog = (state = '', action: any) => {
  switch(action.type) {
    case actions.SET_DIALOG:
      const {toWhat} = action.payload;
      console.log(toWhat);
      return toWhat;
      
    default:
      return state;
  }
}

export default dialog;