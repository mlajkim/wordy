import * as actions from '../actionTypes';

const initialState = {
  addWordLangPref: 'en',
  adddedWordsCount: 0,
  data: []
};

const languages = (state = initialState, action: any) => {
  switch(action.type) {
    case actions.SET_ADD_WORD_LANG_PREF:
      return {...state, addWordLangPref: action.payload.toWhat};

    case actions.SET_ADDED_WORDS_COUNT:
      return {...state, adddedWordsCount: action.payload.count};

      // This is kinda wierd. delete later after confirmation
    // case actions.SET_LANGUAGES:
    //   return {...state, data: action.payload.toWhat};
      
    default:
      return state;
  }
}

export default languages;