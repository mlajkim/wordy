// types
import { WordsChunk, Word, State } from '../../types'
import { NewlyModifyWords } from '../reduxType'
import { WordGetWordInput, WordGetWordPayload } from '../../type/payloadType';
// libraries
import { knuthShuffle } from 'knuth-shuffle';
// Lambda
import { throwEvent } from '../../frontendWambda';
// actions
import * as WORDS_ACTION from '../actions/wordsAction'
import {updateWords, POST_WORDS, SAVING_HELPER, SET_WORDS, GET_WORDS, MODIFY_WORDS, DELETE_WORDS, SYNC_WORDS, MIX_ARRAY} from '../actions/wordsAction';
import { modifySupport, addSemNoDup, deleteSem, getSupport } from '../actions/supportAction';
import { fetchy, fetchy3 } from '../actions/apiAction';
import { setWords, savingHelper } from '../actions/wordsAction';
import { setSnackbar } from '../actions';
import { convertWordsIntoLegacy } from '../../frontendWambda';
import { ResourceId, WordPure } from '../../type/resourceType';

const validate = (payload: WordsChunk): boolean => {
  // This validation requires every payload of words has to have the same sem value. 
  // This web-app adds, removes, and sync in chunk with the same sem value.
  const STANDARD_SEM = payload[0].sem;
  const result = payload.filter((word: Word) => word.sem !== STANDARD_SEM);
  return result.length === 0 ? true : false;
}

// ! Ocotober 20201 
export const newlyEncryptWordsMdl = ({dispatch, getState} : any) => (next: any) => (action: any) => {
  next(action);

  if (action.type === WORDS_ACTION.NEWLY_ENCRYPT_WRODS) {
    const { data } = action.payload as { data: (ResourceId & WordPure)[] }
    const { words }: State = getState()

    // ! This assumes that legacy ID is still present!
    const alteredWords = words.map(wordChunk => {
      wordChunk.map(word => {
        const idx = data.findIndex(el => el.legacyId === word.legacyId)
        if (idx !== -1) return data[idx]
        else return word
      })
    })

    dispatch(updateWords(alteredWords))
  }
}


// ! October, 2021
// ! NOW, THIS ONLY APPLIES TO MINIMAL AMMOUNT, ONLY FRONT END
export const newlyModifyWordsMdl = ({dispatch, getState} : any) => (next: any) => (action: any) => {
  next(action);

  if (action.type === WORDS_ACTION.NEWLY_MODIFY_WORDS) {
    const { type, data } = action.payload as NewlyModifyWords
    const { words, support }: State = getState()
    const dataLength = data.length

    if (type === 'create') {
      dispatch(savingHelper(convertWordsIntoLegacy(data)))
      dispatch(modifySupport({ newWordCnt: support.newWordCnt + dataLength }))
      dispatch(addSemNoDup(data[0].sem))
    } // ! end of create

    

    if (type === 'update') {
      const alteredWords = words.map(wordChunk => {
        return wordChunk.map(word => {
          const idx = data.findIndex(el => el.wrn === word.wrn)
          if (idx !== -1) return data[idx]
          else return word
        } )
      })

      console.log(alteredWords)

      dispatch(updateWords(alteredWords))
      
    } // ! end of update

    if (type === 'delete') {
      dispatch(modifySupport({ deletedWordCnt: support.deletedWordCnt + dataLength }))
      
      const removedWordChunk = words
        .filter(wordChunk => wordChunk
        .filter(word => data.findIndex(el => el.wrn === word.wrn) !== -1))
        .filter(wordChunk => wordChunk !== []) // smoothly remove semester

      dispatch(updateWords(removedWordChunk))

      const sems = removedWordChunk.map(el => el[0].sem)
      if (support.sems.length !== sems.length) dispatch(modifySupport({ sems }))

      } // end of delete
  }
}

// Middlewares
// Fecthy 3
export const getWordsMdl = ({dispatch, getState} : any) => (next: any) => (action: any) => {
  next(action);

  if (action.type === GET_WORDS) {
    const { user }: State = getState()
    const sem = action.payload
    dispatch(fetchy3('get', `/words/${user.ID}/${sem}`, null, setWords))
  }
};

// Fetchy 3
export const setWordsMdl = ({dispatch, getState} : any) => (next: any) => (action: any) => {
  next(action);

  if (action.type === SET_WORDS) {
    // Payload and States
    const payload: WordsChunk  = action.payload;
    const { words }: State = getState();
    
    if(payload.length === 0) return; 
    dispatch(updateWords([...words, payload]));

  } 
};

// Fetchy 3
export const postWordsMdl  = ({dispatch, getState} : any) => (next: any) => (action: any) => {
  // Declaration and data validation check
  next(action);
  
  if (action.type === POST_WORDS) {
    // #1 Validate given data and Declare the necessary.
    const { data } = action.payload;
    const isDataValid = validate(data);
    if (isDataValid === false) dispatch(setSnackbar('Invalid data given ', 'error')); // possibly temporary
    if (isDataValid === false) return;
    const {user, support}: State = getState(); // interesting (learn something)
    const sem = (data as WordsChunk)[0].sem;
    // dispatch(getSupport()); // Update the support just in case // This line of code created a very light non-chagning bug

    // #2 Put some more necessary data
    let newWordCnt: number = support.newWordCnt;
    const newWordsPayload = data.map((word: Word) => {
      newWordCnt += 1;
      return {
        ...word, ownerID: user.ID, isFavorite: false, order: newWordCnt, language: support.addWordLangPref,
        lastReviewed: word.dateAdded, reviewdOn: [], step: 5 //5 for myself and eventually 1 later.
      } as Word
    });

    // #3 Handle Back & Front
    dispatch(fetchy3('post', '/words/fetchy3', newWordsPayload, savingHelper));

    // Adding Words will have an affect on supports.
    dispatch(modifySupport({ newWordCnt }));
    dispatch(addSemNoDup(sem));
  }
};

// #MODIFY
export const modifyWordsMdl = ({dispatch, getState} : any) => (next: any) => (action: any) => {
  next(action);

  if(action.type === MODIFY_WORDS) {
    const {sem, data}: {sem: number, data: {wordID: string, payload: object}[]} = action.payload;
    const {words}: State = getState();

    dispatch(fetchy('put', '/words', data));
    const hasFound = (words as WordsChunk[]).find(datus => datus[0].sem === sem);
    if (typeof hasFound !== "undefined") {
      const newWords = hasFound.map(word => {
        const index = data.findIndex(datus => datus.wordID === word._id);
        if (index !== -1) {
          const newProperty = data.splice(index, 1)[0].payload;
          return {...word, ...newProperty}
        }
        return word;
      });
      dispatch(updateWords([...words.filter(wordsChunk => wordsChunk[0].sem !== sem), newWords])) //add
    }

    // Removing words may have an affect on supports
  }
};

export const deleteWordsMdl = ({dispatch, getState} : any) => (next: any) => (action: any) => {
  next(action);

  if(action.type === DELETE_WORDS) {
    const {sem, IDs}: {sem: number, IDs: {ID: string}[]} = action.payload;
    const {words, support}: State = getState();
    const deletedWordCnt = support.deletedWordCnt + IDs.length;

    dispatch(fetchy('delete', '/words', IDs));
    const hasFound = (words as WordsChunk[]).find(datus => datus[0].sem === sem);
    if (typeof hasFound !== "undefined") {
      const newChunk = hasFound.filter(word => {
        const index = IDs.findIndex(datus => datus.ID === word._id);
        if (index !== -1) {
          IDs.splice(index, 1);
          return false;
        }
        return true;
      });
      if (newChunk.length === 0) {
        dispatch(deleteSem(sem));
        dispatch(updateWords([...words.filter(wordsChunk => wordsChunk[0].sem !== sem)]));
      }
      else
        dispatch(updateWords([...words.filter(wordsChunk => wordsChunk[0].sem !== sem), newChunk]));
    }
    dispatch(modifySupport({ deletedWordCnt }))
  }
};

export const savingHelperMdl = ({dispatch, getState} : any) => (next: any) => (action: any) => {
  next(action);

  if(action.type === SAVING_HELPER) {
    const newWords: WordsChunk = action.payload; // payload first
    const {words: prevWords, support}: State = getState(); // global states next
    const semOfNewWords = newWords[0].sem;
    const sems = support.sems;
    // Logic
    let hasFound = (prevWords as WordsChunk[]).find(datus => datus[0].sem === semOfNewWords);
    if(typeof hasFound === "undefined") {
      // You want to chwck if it exists in the database.
      const foundIndex = sems.findIndex(sem => sem === semOfNewWords);
      if (foundIndex === -1) dispatch(updateWords([...prevWords, newWords])); // because it does not exist
      // 만약에 다운을 안 받은 상태면 애초에 다운 받을 필요가 없으므로 안함. 누르고 추가 잘 되므로 이상.
    }
    else { // already has been downloaded.
      hasFound = [...hasFound, ...newWords];
      dispatch(updateWords([...(prevWords as WordsChunk[]).filter(elem => elem[0].sem !== semOfNewWords), hasFound]))
    }
    
  }
};

export const syncWordsMdl = ({dispatch, getState} : any) => (next: any) => async (action: any) => {
  next(action);
  if(action.type === SYNC_WORDS) {
    // Payload and States
    const { syncTargetSem } = action.payload;
    const { user, words }: State = getState();
    dispatch(getSupport());

    // ! 1) Delete previous data
    const newWordsList = words.filter(wordChunk => wordChunk[0].sem !== syncTargetSem);
    dispatch(updateWords(newWordsList));

    // 2) Start downloading here ...
    await throwEvent("word:getWord", { sem: syncTargetSem, legacyMongoId: user.ID! } as WordGetWordInput)
      .then(res => {
        if (res.serverResponse !== "Accepted") return
        
        // ! 3) Convert into legacy forma
        const foundWordChunk = res.payload as WordGetWordPayload
        const converted: Word[] = convertWordsIntoLegacy(foundWordChunk)

        // ! 4) Apply frontend
        dispatch(setWords(converted))
      })
      .catch(() => {
        // ! F-1) Failed. bring back what you already have.
        dispatch(updateWords(words)) // Bring back, if it fails somehow
      })

    // dispatch(getWords(syncTargetSem)); // (Legacy)
  };
};

/**
 * Written on Jul 26, 2021
 * Takes a number (sem) value and mixs the array.
 * Never goes back to the normal, but since all the words have the sem value
 * and therefore does not have to go back
 * @param param0 takes semester value (number)
 * @returns the new array with one mixed
 */
export const mixWordsMdl = ({dispatch, getState} : any) => (next: any) => (action: any) => {
  next(action);

  if (action.type === MIX_ARRAY) {
    const mixingSem = action.payload;
    const { words }: State = getState();

    const idx = words.findIndex(wordChunk => wordChunk[0].sem === mixingSem);
    // Valdiation
    if (idx === -1) return;

    const mixedArray = knuthShuffle(words[idx].slice(0));
    words.splice(idx, 1);
    const newWordsArray = [...words, mixedArray];
    dispatch(updateWords(newWordsArray));
    
    // filteredWordsList = knuthShuffle(filteredWordsList.slice(0));


  };
};

export const wordsMdl = [
  newlyEncryptWordsMdl,
  newlyModifyWordsMdl, 
  // Legacy below
  getWordsMdl, 
  setWordsMdl, 
  postWordsMdl, 
  modifyWordsMdl, 
  deleteWordsMdl, 
  savingHelperMdl, 
  syncWordsMdl, 
  mixWordsMdl
]