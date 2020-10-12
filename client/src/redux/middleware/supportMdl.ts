import {SET_SUPPORT, ADD_SEM, SYNC_SUPPORT, updateSupport} from '../actions/support';
import {State} from '../../types';
import { fetchy } from '../actions/api';
import * as API from '../../API';

export const setSupport = ({dispatch} : any) => (next: any) => (action: any) => {
  next(action);

  if (action.type === SET_SUPPORT) {
    dispatch(updateSupport(action.payload));
  }
}

export const addSem = ({dispatch, getState} : any) => (next: any) => (action: any) => {
  next(action);

  if (action.type === ADD_SEM) {
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

export const syncSupport = ({dispatch, getState} : any) => (next: any) => (action: any) => {
  next(action);
  const {user}: State = getState();
  if (action.type === SYNC_SUPPORT) {
    const {empty, data} = API.fetchy('get', '/supports', user.ID!);
    if(!empty) dispatch(updateSupport(data[0]))
  }
}


export const supportMdl = [setSupport, addSem, syncSupport]; 