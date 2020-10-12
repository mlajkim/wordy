import {WordsChunk} from '../../types';
export const UPDATE_WORDS="[WORDS] Update";
export const POST_WORDS = "[WORDS] Post";
export const GET_WORDS = '[WORDS] Get'
export const SET_WORDS = "[WORDS] Set"
export const SAVING_HELPER = '[WORDS] Saving Helper'
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

export const getWords = (sem: number) => {
  return {
    type: GET_WORDS,
    payload: sem
  }
}

export const setWords = (data: any) => {
  return {
    type: SET_WORDS,
    payload: data
  }
}

export const savingHelper = (data: any) => {
  return {
    type: SAVING_HELPER,
    payload: data
  }
}

// @POST
export const postWords = (data: Required[]) => {
  return {
    type: POST_WORDS,
    payload: data
  }
}

// @SET


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