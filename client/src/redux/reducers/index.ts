import { combineReducers } from 'redux';
// Reducers
import dialog from './dialog';
import page from './page';
import language from './language';
import isSignedIn from './isSignedIn';
import user from './user';
import languages from './languages';

export default combineReducers({
  dialog, page, language, isSignedIn, user, languages
});
