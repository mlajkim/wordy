import { combineReducers } from 'redux';
// Reducers
import dialog from './dialog';
import page from './page';

export default combineReducers({
  dialog, page
});
