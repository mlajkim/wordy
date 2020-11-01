import * as actions from '../actionTypes';
import { Support } from '../../types';
import {UPDATE_SUPPORT} from '../actions/supportAction';


const initialState: Support = {
  version: 'Beta v0.2.1 (Nov 1, 2020)',
  addWordLangPref: 'en', // user's prefrenece of adding language
  newWordAddingType: 'one',
  newWordCnt: 0,
  deletedWordCnt: 0,
  sems: [],
  wordOrderPref: 'asc',
  yearOrderPref: 'asc',
  wordDisplayPref: 'wordcard',
  lastTags: [],
  recommandedTags: [],
  // reviews
  maxStep: 8,
  steps: [1, 8, 24, 72, 168, 336, 720, 720],
  // old
  addedWordsCount: 0, // 
  deletedWordsCount: 0
};

// this is more of userPreference (I will change the naming later)
const supports = (state = initialState, action: any) => {
  switch(action.type) {
    
    case UPDATE_SUPPORT:
      return {...state, ...action.payload}
    //
    case actions.SET_ADD_WORD_LANG_PREF:
      return {...state, addWordLangPref: action.payload.toWhat};
    
    // Count mechanism
    case actions.SET_ADDED_WORDS_COUNT:
      return {...state, addedWordsCount: action.payload.count};

    case actions.INCREMENT_ADDED_WORDS_COUNT:
      const prevAdddedWordsCount = state.addedWordsCount;
      console.log(prevAdddedWordsCount)
      return {...state, addedWordsCount: prevAdddedWordsCount + 1};

    // Deleted Count
    case actions.SET_DELETED_WORDS_COUNT:
      return {...state, deletedWordsCount: action.payload.count};

    case actions.INCREMENT_DELETED_WORDS_COUNT:
      const prevDeletedWordsCount = state.deletedWordsCount;
      return {...state, deletedWordsCount: prevDeletedWordsCount + 1};
      
    // MASS or single word adding style
    case actions.SET_NEW_WORD_ADDING_TYPE:
      return {...state, newWordAddingType: action.payload.type}

      // This is kinda wierd. delete later after confirmation
    // case actions.SET_LANGUAGES:
    //   return {...state, data: action.payload.toWhat};
      
    default:
      return state;
  }
}

export default supports;