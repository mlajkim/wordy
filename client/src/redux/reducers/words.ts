import * as actions from '../actionTypes';

const words = (state = [], action: any) => {
  switch(action.type) {
    case actions.ADD_CHUNK_INTO_DATA:
      return [...state, {
        ...action.payload
      }];
      
    default:
      return state;
  }
}

export default words;