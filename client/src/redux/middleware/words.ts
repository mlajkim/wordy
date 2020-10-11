import { WordsChunk, Word } from '../../types';
import {ADD_WORDS, updateWords} from '../actions/words';
import {setSnackbar} from '../actions';

const validate = (payload: WordsChunk): boolean => {
  // This validation requires every payload of words has to have the same sem value. 
  // This web-app adds, removes, and sync in chunk with the same sem value.
  const STANDARD_SEM = payload[0].sem;
  const result = payload.filter((word: Word) => word.sem !== STANDARD_SEM);
  return result.length === 0 ? true : false;
}

// #ADD
export const addWords = ({dispatch, getState} : any) => (next: any) => (action: any) => {
  // Declaration and data validation check
  next(action);
  

  if (action.type === ADD_WORDS) {
    const {payload} = action;
    const isDataValid = validate(payload);
    if (isDataValid === false) dispatch(setSnackbar('Invalid data given ', 'error')); // possibly temporary
    if (isDataValid === false) return;

    const {words: previosWords} = getState(); // interesting (learn something)
    const sem = (payload as WordsChunk)[0].sem;
    // Simple logic following:
    // Figure out if has found, if not, its a new sem chunk, simply add.
    let hasFound = (previosWords as WordsChunk[]).filter(elem => elem[0].sem !== sem);
    if(hasFound === undefined) {
      // If the same sem chunk is not found, I can simply add them into.
      dispatch(updateWords([...previosWords, payload]));
    }
    else {
      hasFound = [...hasFound, ...payload];
      dispatch(updateWords([...(previosWords as WordsChunk[]).filter(elem => elem[0].sem !== sem), hasFound]))
    }
  }
};

// #SYNC
export const syncWords = ({dispatch, getState} : any) => (next: any) => (action: any) => {

};

// #MODIFY
export const modifyWords = ({dispatch, getState} : any) => (next: any) => (action: any) => {

};

// #REMOVE
export const removeWords = ({dispatch, getState} : any) => (next: any) => (action: any) => {

};


export const wordsMdl = [addWords, syncWords, modifyWords, removeWords]; 