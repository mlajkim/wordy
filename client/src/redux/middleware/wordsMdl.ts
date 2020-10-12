import { WordsChunk, Word, State } from '../../types';
import {updateWords, POST_WORDS, SYNC_WORDS, SET_WORDS} from '../actions/wordsAction';
import {setSupport, modifySupport, addSemNoDup} from '../actions/supportAction';
import {fetchy} from '../actions/apiAction';
import {setWords} from '../actions/wordsAction';
import {setSnackbar} from '../actions';

const validate = (payload: WordsChunk): boolean => {
  // This validation requires every payload of words has to have the same sem value. 
  // This web-app adds, removes, and sync in chunk with the same sem value.
  const STANDARD_SEM = payload[0].sem;
  const result = payload.filter((word: Word) => word.sem !== STANDARD_SEM);
  return result.length === 0 ? true : false;
}

// #POST
export const postWords  = ({dispatch, getState} : any) => (next: any) => (action: any) => {
  // Declaration and data validation check
  next(action);
  
  if (action.type === POST_WORDS) {
    // #1 Validate given data and Declare the necessary.
    const {payload} = action;
    const isDataValid = validate(payload);
    if (isDataValid === false) dispatch(setSnackbar('Invalid data given ', 'error')); // possibly temporary
    if (isDataValid === false) return;
    const {user, words: previosWords, support}: State = getState(); // interesting (learn something)
    const sem = (payload as WordsChunk)[0].sem;

    // #2 Put some more necessary data
    let newWordCnt: number = support.newWordCnt;
    const newPayload = payload.map((word: Word) => {
      newWordCnt += 1;
      return {
        ...word, ownerID: user.ID, isFavorite: false, order: newWordCnt
      } as Word
    });

    // #3 Handle Back & Front
    dispatch(fetchy('post', '/words', newPayload));
    dispatch(setWords(newPayload))

    // Adding Words will have an affect on supports.
    dispatch(fetchy('put', '/supports', [{ newWordCnt }]));
    dispatch(modifySupport({ newWordCnt }));
    dispatch(addSemNoDup(sem));
  }
};

// #SYNC
export const syncWords = ({dispatch, getState} : any) => (next: any) => (action: any) => {
  next(action);

  if(action.type === SYNC_WORDS) {
    const {words}: State = getState();
    const sem = action.payload[0].sem;
    const newData = dispatch(fetchy('get', '/words', action.payload));
    console.log(newData); // testing
    dispatch(updateWords([...words.filter((datus: WordsChunk) => datus[0].sem !== sem), ...newData]))
  }
};

// #MODIFY
export const modifyWords = ({dispatch, getState} : any) => (next: any) => (action: any) => {
  next(action);
};

// #REMOVE
export const removeWords = ({dispatch, getState} : any) => (next: any) => (action: any) => {
  next(action);
};

// #SET
export const declareWords = ({dispatch, getState} : any) => (next: any) => (action: any) => {
  next(action);

  if(action.type === SET_WORDS) {
    const newWords: WordsChunk = action.payload; // payload first
    const {words: prevWords}: State = getState(); // global states next
    const standardSem = newWords[0].sem;
    // Logic
    let hasFound = (prevWords as WordsChunk[]).find(datus => datus[0].sem === standardSem);
    if(hasFound === undefined) {
      // If the same sem chunk is not found, I can simply add them into.
      dispatch(updateWords([...prevWords, newWords]));
    }
    else {
      hasFound = [...hasFound, ...newWords];
      dispatch(updateWords([...(prevWords as WordsChunk[]).filter(elem => elem[0].sem !== standardSem), hasFound]))
    }
    
  }
};


export const wordsMdl = [postWords, syncWords, modifyWords, removeWords, declareWords]; 