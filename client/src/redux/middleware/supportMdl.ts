import {updateSupport, SET_SUPPORT, MODIFY_SUPPORT, SYNC_SUPPORT, ADD_SEM_NO_DUPLICATE} from '../actions/supportAction';
import {State} from '../../types';
import { fetchy } from '../actions/apiAction';
import * as API from '../../API';

export const setSupport = ({dispatch} : any) => (next: any) => (action: any) => {
  next(action);

  if (action.type === SET_SUPPORT) {
    dispatch(updateSupport(action.payload));
  }
}

export const modifySupport = ({dispatch} : any) => (next: any) => (action: any) => {
  next(action);

  if (action.type === MODIFY_SUPPORT) {
    const payload: object = action.payload;
    dispatch(fetchy('put', '/supports', [payload]))
    dispatch(updateSupport(payload));
  }
}

export const syncSupport = ({dispatch, getState} : any) => (next: any) => (action: any) => {
  next(action);
  const {user}: State = getState();
  if (action.type === SYNC_SUPPORT) {
    const {empty, data} = API.fetchy('get', '/supports', user.ID!);
    if(!empty) dispatch(updateSupport(data[0]))
  }
}

export const addSemNoDup = ({dispatch, getState} : any) => (next: any) => (action: any) => {
  next(action);

  if (action.type === ADD_SEM_NO_DUPLICATE) {
    const {support}: State = getState();
    const sem = action.payload;

    // #1 if already exists, no need to update at all
    const isFound = support.sems.find(elem => elem === sem) ? true : false;
    if(isFound === false) {
      const newSem = [...support.sems, sem] // existed + new(payload)
      dispatch(updateSupport({sem: newSem}));
    }
    
  }
}




export const supportMdl = [setSupport, addSemNoDup, syncSupport]; 