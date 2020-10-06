import { AccordionActions } from '@material-ui/core';
import * as actions from '../actionTypes';

const initialState = {
  addWordLangPref: '',
  data: []
};

const languages = (state = initialState, action: any) => {
  switch(action.type) {
    case actions.SET_ADD_WORD_LANG_PREF:
      return {...state, addWordLangPref: action.payload.toWhat};

    case actions.SET_LANGUAGES:
      return {...state, data: action.payload.toWhat};
      
    default:
      return state;
  }
}

export default languages;