// type
import * as actions from '../actionTypes';
import { OkrLoading } from '../../types';

// initial state, as loading is false
const initialState: OkrLoading = {
  isLoading: false,
  foundData: undefined
};

const okrLoading = (state = initialState, action: any) => {  
  switch(action.type) {
    case actions.SET_OKR_RELOAD_ON:
      const payload = action.payload as undefined | any;
      return {
        isLoading: true, foundData: payload
      };
    
    case actions.SET_OKR_RELOAD_OFF:
      return initialState

    default:
      return state;
  }
}

export default okrLoading;