import { combineReducers } from 'redux';
// Reducers
import dialog from './dialog';
import page from './page';
import language from './language';
import user from './userReducer';
import support from './supportReducer';
import words from './wordsReducer';
import snackbar from './snackbar';
import scrabbly from './scrabblyReducers';
import keepStyleBtn from './keepStyleBtnReducer';
// New OKR
import okrLoading from './okrLoading'

export default combineReducers({
  // New (commented on Aug 12, 2021)
  okrLoading,
  // Old below
  dialog, 
  page, 
  // This represents the wordy app's default showing languages
  language, 
  // user state is to identify the current use of the website.
  // it should ideally contain only datas tto identify them
  user, 
  support,
  // handles all those downloaded words (usually used for the data preservance and speed)
  words,
  snackbar,
  scrabbly,
  keepStyleBtn,
});
