// Types
import { WordsChunk } from '../../types'
import Wrn from '../../type/wrn'
import { NewlyModifyWords } from '../reduxType'
// Actions
export const NEWLY_DELETE_WORDS = "[Newly] Delete Words"
export const NEWLY_MODIFY_WORDS = "[Newly] Modify Words"
export const NEWLY_ENCRYPT_WRODS = "[Newly] Encrypt Words"
// Legacy below
export const UPDATE_WORDS="[WORDS] Update";
export const POST_WORDS = "[WORDS] Post";
export const GET_WORDS = '[WORDS] Get'
export const SET_WORDS = "[WORDS] Set"
export const SAVING_HELPER = '[WORDS] Saving Helper'
export const MODIFY_WORDS = "[WORDS] Modify";
export const DELETE_WORDS = "[WORDS] Delete";
export const SYNC_WORDS = "[WORDS] Sync";
export const MIX_ARRAY = "[WORDS] Mixed one sem array"


// ! November, 2021
export const newlyDeleteWords = (deletingSem: number, wrns: Wrn[] ) => {
  return {
    type: NEWLY_DELETE_WORDS,
    payload: { deletingSem, wrns }
  }
}

// ! APIGATEWAY October, 2021
export const newlyEncryptWords = (data: any) => {
  return {
    type: NEWLY_ENCRYPT_WRODS,
    payload: { data }
  }
}

// ! APIGATEWAY October, 2021
export const newlyModifyWords = ({ type, data, wrns }: NewlyModifyWords) => {
  return {
    type: NEWLY_MODIFY_WORDS,
    payload: { type , data, wrns }
  }
}

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

export const postWords = (data: Required[], useLatestApigateway?: boolean) => {
  return {
    type: POST_WORDS,
    payload: { data, useLatestApigateway}
  }
}

export const modifyWords = (sem: number, data: Data[])  => {
  return {
    type: MODIFY_WORDS,
    payload: { sem, data }
  }
}

export const deleteWords = (sem: number, wrns: {wrn: Wrn}[])  => {
  return {
    type: DELETE_WORDS,
    payload: { sem, wrns }
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

export const mixWords = (sem: number) => {
  return {
    type: MIX_ARRAY,
    payload: sem
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