// Types
import { WordsChunk } from '../../types';
// Actions
export const UPDATE_WORDS="[WORDS] Update";
export const POST_WORDS = "[WORDS] Post";
export const GET_WORDS = '[WORDS] Get'
export const SET_WORDS = "[WORDS] Set"
export const SAVING_HELPER = '[WORDS] Saving Helper'
export const MODIFY_WORDS = "[WORDS] Modify";
export const DELETE_WORDS = "[WORDS] Delete";
export const SYNC_WORDS = "[WORDS] Sync";

// Ultimate
export const updateWords = (data: any) => {
  return {
    type: UPDATE_WORDS,
    payload: data
  };
};
// Fetchy 3
export const getWords = (sem: number) => {
  return {
    type: GET_WORDS,
    payload: sem
  }
}
// Fetchy 3
export const setWords = (payload: any) => {
  return {
    type: SET_WORDS,
    payload
  }
}

export const postWords = (data: Required[]) => {
  return {
    type: POST_WORDS,
    payload: data
  }
}

export const modifyWords = (sem: number, data: Data[])  => {
  return {
    type: MODIFY_WORDS,
    payload: { sem, data }
  }
}

export const deleteWords = (sem: number, IDs: {ID: string}[])  => {
  return {
    type: DELETE_WORDS,
    payload: {sem, IDs}
  }
}

export const savingHelper = (words: WordsChunk) => {
  return {
    type: SAVING_HELPER,
    payload: words
  }
};
// Fetchy 3
export const syncWords = (syncTargetSem: number) => {
  return {
    type: SYNC_WORDS,
    payload: { syncTargetSem }
  }
}

type Data = {
  wordID: string,
  payload: object
}

type Required = {
  word: string
  sem: number
  pronun?: string 
  meaning?: string 
  example?: string 
  isPublic?: boolean
  tag?: string[]
}