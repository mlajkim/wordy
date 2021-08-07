import {createStore, compose, applyMiddleware} from 'redux';
import rootReducer from "./reducers/indexReducer";
// Middlewares
import { userMdl } from './middleware/userMdl';
import { wordsMdl } from './middleware/wordsMdl';
import { apiMdl } from './middleware/apiMdl';
import { supportMdl } from './middleware/supportMdl';
import { scrabblyMdl } from './middleware/scrabblyMdl';
import { keepStyleBtnMdl } from './middleware/keepStyleBtnMdl';
// dev tool
const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default createStore(
  rootReducer, 
  composeEnhancers(
    applyMiddleware(...userMdl, ...wordsMdl, ...apiMdl, ...supportMdl, ...scrabblyMdl, ...keepStyleBtnMdl)
  )
);
