export const UPDATE_WORDS="[WORDS] Update";
export const POST_WORDS = "[WORDS] Post";
export const GET_WORDS = '[WORDS] Get'
export const SET_WORDS = "[WORDS] Set"
export const SAVING_HELPER = '[WORDS] Saving Helper'
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

export const savingHelper = (data: any) => {
  return {
    type: SAVING_HELPER,
    payload: data
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