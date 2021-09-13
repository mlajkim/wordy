// Type
import { SET_LANGUAGE } from '../actionTypes';
import { DisplayableLn } from '../../type/availableType';

const INITIAL_STATE: DisplayableLn = 'en'; 

const langauge = (state = INITIAL_STATE, action: any) => {
  switch(action.type) {
    case SET_LANGUAGE:
      return action.payload.toWhat;
      
    default:
      return state;
  }
}

export default langauge;