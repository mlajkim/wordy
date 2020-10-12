import {WordsChunk} from '../../types';
export const UPDATE_WORDS="[WORDS] Update";
export const POST_WORDS = "[WORDS] Post";
export const SET_WORDS = "[WORDS] Set"
export const SYNC_WORDS = "[WORDS] Sync";
export const MODIFY_WORDS = "[WORDS] Modify";
export const DELETE_WORDS = "[WORDS] Delete";

// Ultimate
export const updateWords = (data: any) => {
  return {
    type: UPDATE_WORDS,
    payload: data
  };
};

// @POST
export const postWords = (data: Required[]) => {
  return {
    type: POST_WORDS,
    payload: data
  }
}

// @SET
export const setWords = (data: WordsChunk) => {
  return {
    type: SET_WORDS,
    payload: data
  }
}

// @SYNC
export const syncWords = (sem: number) => {
  return {
    type: SYNC_WORDS,
    payload: [{sem}]
  }
}

type Required = {
  word: string
  pronun: string 
  meaning: string 
  example: string 
  isPublic: boolean
  sem: number
  tag: string[]
}