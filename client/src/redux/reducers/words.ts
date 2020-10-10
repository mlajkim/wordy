import { Word, WordData } from '../../types';
import * as actions from '../actionTypes';
import {UPDATE_WORDS} from '../actions/words';

const words = (state = [], action: any) => {
  switch(action.type) {
    case UPDATE_WORDS:
      return action.payload;

    // old these
    case actions.ADD_CHUNK_INTO_DATA:
      return [...state, {
        ...action.payload
      }];
    
    case actions.ADD_ONE_WORD_INTO_DATA:
      const word: Word = action.payload.word;
      if(state.length === 0)　return [{ year: word.year, sem: word.sem, data: [{...word}] }];
      // if there is data, but the years does not match?
      const found = state.find((datum: WordData) => datum.year === word.year && datum.sem === word.sem);
      if(found) {
        return [...state.filter((datum: WordData) => datum.year !== word.year || datum.sem !== word.sem), {
          year: word.year, sem: word.sem, data: [...(found as WordData).data, word]
        }];
      }
      return [...state, {year: word.year, sem: word.sem, data: [{ ...word }]}];

    // Extremely complicated (Confirmed logically)
    case actions.DELETE_ONE_WORD_FROM_DATA:
      const { deletingTarget, wordID, year, sem } = action.payload;
      return [...state.filter((datum: WordData) => datum.year !== year || datum.sem !== sem),{
        year, sem, data: (deletingTarget as WordData).data.filter((datus: Word) => datus._id !== wordID)
      }];
        
    default:
      return state;
  }
}

export default words;