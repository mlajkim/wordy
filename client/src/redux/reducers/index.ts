import { combineReducers } from 'redux';
// Reducers
import dialog from './dialog';
import page from './page';
import language from './language';
import isSignedIn from './isSignedIn';

export default combineReducers({
  dialog, page, language, isSignedIn
});
