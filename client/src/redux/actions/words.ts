import {WordsChunk} from '../../types';
export const UPDATE_WORDS="[WORDS] Update";
export const ADD_WORDS = "[WORDS] Add";

export const addWords = (data: any) => {
  return {
    type: ADD_WORDS,
    payload: data
  }
}

// Finally
export const updateWords = (data: any) => {
  return {
    type: UPDATE_WORDS,
    payload: data
  };
};