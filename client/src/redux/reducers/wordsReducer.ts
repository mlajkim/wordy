import {UPDATE_WORDS} from '../actions/wordsAction';

const words = (state = [], action: any) => {
  switch(action.type) {
    case UPDATE_WORDS:
      return action.payload;

    default:
      return state;
  }
}

export default words;