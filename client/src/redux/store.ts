import {createStore, compose, applyMiddleware} from 'redux';
import { userMdl } from './middleware/user';
import { wordsMdl } from './middleware/words';
import rootReducer from "./reducers";

// dev tool
const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default createStore(
  rootReducer, 
  composeEnhancers(
    applyMiddleware(...userMdl, ...wordsMdl)
  )
);
