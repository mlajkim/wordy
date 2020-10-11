import {UPDATE_WORDS} from '../actions/words';

const words = (state = [], action: any) => {
  switch(action.type) {
    case UPDATE_WORDS:
      console.log('does it even reach')
      return action.payload;

    default:
      return state;
  }
}

export default words;