import { combineReducers } from 'redux';
// Reducers
import dialog from './dialog';
import page from './page';
import language from './language';
import isSignedIn from './isSignedIn';
import user from './user';
import languages from './languages';
import years from './years';
import words from './words';
import snackbar from './snackbar';

export default combineReducers({
  dialog, 
  page, 
  // This represents the wordy app's default showing languages
  language, 
  isSignedIn, 
  // user state is to identify the current use of the website.
  // it should ideally contain only datas tto identify them
  user, 
  languages,
  // This years data is for the performance of data loading
  years,
  // handles all those downloaded words (usually used for the data preservance and speed)
  words,
  snackbar
});
