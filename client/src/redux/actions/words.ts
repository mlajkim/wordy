import {WordsChunk} from '../../types';
export const UPDATE_WORDS="[WORDS] Update";
export const ADD_WORDS = "[WORDS] Add";

export const addWords = (chunk: WordsChunk) => {
  return {
    type: ADD_WORDS,
    payload: chunk
  }
}

// Finally
export const updateWords = (data: any) => {
  return {
    type: UPDATE_WORDS,
    payload: data
  };
};