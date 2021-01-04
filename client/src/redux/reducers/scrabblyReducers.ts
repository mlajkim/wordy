import { Scrabbly } from '../../types';
import { REFRESH_SCRABBLY, UPDATE_SCRABBLY } from '../actions/scrabblyAction';

const initialState: Scrabbly = {
  step: 'initialize'
};

// this is more of userPreference (I will change the naming later)
const scrabbly = (state = initialState, action: any) => {
  switch(action.type) {
    
    case UPDATE_SCRABBLY:
      return {...state, ...action.payload}

    case REFRESH_SCRABBLY:
      return { ...initialState }
      
    default:
      return state;
  }
}

export default scrabbly;