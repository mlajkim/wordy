import * as actions from '../actionTypes';

const initialState = {
  addWordLangPref: 'en',
  addedWordsCount: 0,
  deletedWordsCount: 0,
  data: []
};

const languages = (state = initialState, action: any) => {
  switch(action.type) {
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

      // This is kinda wierd. delete later after confirmation
    // case actions.SET_LANGUAGES:
    //   return {...state, data: action.payload.toWhat};
      
    default:
      return state;
  }
}

export default languages;