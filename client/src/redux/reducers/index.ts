import { combineReducers } from 'redux';
// Reducers
import dialog from './dialog';
import page from './page';
import language from './language';

export default combineReducers({
  dialog, page, language
});
