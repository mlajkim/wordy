import {updateSupport, GET_SUPPORT, SET_SUPPORT, MODIFY_SUPPORT, SYNC_SUPPORT, ADD_SEM_NO_DUPLICATE} from '../actions/supportAction';
import {getSupport} from '../actions/supportAction';
import {State, FetchyResponse} from '../../types';
import { fetchy } from '../actions/apiAction';

export const getMdl = ({dispatch} : any) => (next: any) => (action: any) => {
  next(action);

  if (action.type === GET_SUPPORT) {
    const {empty, data}  = action.payload as FetchyResponse;
    if(empty) dispatch(fetchy('post', '/supports'))
    // since it is the fresh new baked data from database (Ultimate soruce) set it to front
    dispatch(updateSupport({
      sems: empty ? [] : data.sems,
      newWordCnt: empty ? 0 : data.newWordCnt,
      deletedWordCnt: empty ? 0 : data.deletedWordCnt
    }))
  }
}

export const modifyMdl = ({dispatch} : any) => (next: any) => (action: any) => {
  next(action);

  if (action.type === MODIFY_SUPPORT) {
    const payload: object = action.payload;
    console.log(payload);
    dispatch(fetchy('put', '/supports', [payload]))
    dispatch(updateSupport(payload));
  }
}

export const syncMdl = ({dispatch, getState} : any) => (next: any) => (action: any) => {
  next(action);
  
  if (action.type === SYNC_SUPPORT) {
    dispatch(fetchy('get', '/supports', null, getSupport));
  }
}

export const addSemNoDupMdl = ({dispatch, getState} : any) => (next: any) => (action: any) => {
  next(action);

  if (action.type === ADD_SEM_NO_DUPLICATE) {
    const {support}: State = getState();
    const sem = action.payload;

    // #1 if already exists, no need to update at all
    const isFound = support.sems.find(elem => elem === sem) ? true : false;
    if(isFound === false) {
      const newSem = [...support.sems, sem] // existed + new(payload)
      dispatch(updateSupport({sems: newSem}));
      dispatch(fetchy('put', '/supports', [{sems: newSem}]))
    }
    
  }
}




export const supportMdl = [getMdl, modifyMdl, syncMdl, addSemNoDupMdl]; 