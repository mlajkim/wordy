import {createStore, compose, applyMiddleware} from 'redux';
import rootReducer from "./reducers";
// Middlewares
import { userMdl } from './middleware/user';
import { wordsMdl } from './middleware/words';
import { apiMdl } from './middleware/api';
import { supportMdl } from './middleware/support';
// dev tool
const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default createStore(
  rootReducer, 
  composeEnhancers(
    applyMiddleware(...userMdl, ...wordsMdl, ...apiMdl, ...supportMdl)
  )
);
