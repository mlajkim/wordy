import { WordsChunk, Word, State } from '../../types';
import {ADD_WORDS, updateWords} from '../actions/words';
import {fetchy} from '../actions/api';
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
    // #1 Validate given data and Declare the necessary.
    const {payload} = action;
    const isDataValid = validate(payload);
    if (isDataValid === false) dispatch(setSnackbar('Invalid data given ', 'error')); // possibly temporary
    if (isDataValid === false) return;
    const {user, words: previosWords, languages}: State = getState(); // interesting (learn something)

    // #2 Put some more necessary data
    const newPayload = payload.map((word: Word, idx: number) => {
      return {
        ...word, ownerID: user.ID, isFavorite: false, order: languages.addedWordsCount + 1 + idx
      } as Word
    });

    // #3 Handle Back-end
    dispatch(fetchy('post', '/words', newPayload));

    // #4 Handle Front-end
    const sem = (newPayload as WordsChunk)[0].sem;
    let hasFound = (previosWords as WordsChunk[]).filter(elem => elem[0].sem === sem);
    if(hasFound === undefined) {
      // If the same sem chunk is not found, I can simply add them into.
      dispatch(updateWords([...previosWords, newPayload]));
    }
    else {
      hasFound = [...hasFound, ...newPayload];
      dispatch(updateWords([...(previosWords as WordsChunk[]).filter(elem => elem[0].sem !== sem), hasFound]))
    }
  }
};

// #SYNC
export const syncWords = ({dispatch, getState} : any) => (next: any) => (action: any) => {
  next(action);
};

// #MODIFY
export const modifyWords = ({dispatch, getState} : any) => (next: any) => (action: any) => {
  next(action);
};

// #REMOVE
export const removeWords = ({dispatch, getState} : any) => (next: any) => (action: any) => {
  next(action);
};


export const wordsMdl = [addWords, syncWords, modifyWords, removeWords]; 