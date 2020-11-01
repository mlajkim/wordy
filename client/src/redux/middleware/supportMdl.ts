import {updateSupport, GET_SUPPORT, SET_SUPPORT, MODIFY_SUPPORT, DELETE_SEM, ADD_SEM_NO_DUPLICATE, MODIFY_RECOMMANDED_TAGS} from '../actions/supportAction';
import { setSupport , modifySupport } from '../actions/supportAction';
import {State, FetchyResponse} from '../../types';
import { fetchy } from '../actions/apiAction';

export const getSupportMdl = ({dispatch} : any) => (next: any) => (action: any) => {
  next(action);

  if (action.type === GET_SUPPORT) {
    dispatch(fetchy('get', '/supports', null, setSupport));
  }
}

export const setSupportMdl = ({dispatch} : any) => (next: any) => (action: any) => {
  next(action);

  if (action.type === SET_SUPPORT) {
    const {empty, data}  = action.payload as FetchyResponse;
    if(empty) dispatch(fetchy('post', '/supports'));
    // since it is the fresh new baked data from database (Ultimate soruce) set it to front
    if(!empty) dispatch(updateSupport({
      ...data,
      ownerID: null,
      __v: null,
      _id: null
    }))
  }
}

export const modifyMdl = ({dispatch} : any) => (next: any) => (action: any) => {
  next(action);

  if (action.type === MODIFY_SUPPORT) {
    const payload: object = action.payload;
    dispatch(fetchy('put', '/supports', [payload]))
    dispatch(updateSupport(payload));
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
};

export const deleteSemMdl = ({dispatch, getState} : any) => (next: any) => (action: any) => {
  next(action);

  if (action.type === DELETE_SEM) {
    const {support}: State = getState();
    const sem = action.payload;

    const newSem = support.sems.filter(elem => elem !== sem);
    dispatch(updateSupport({sems: newSem}));
    dispatch(fetchy('put', '/supports', [{sems: newSem}]))
  };
};

export const modifyRecommandedTagsMdl = ({dispatch, getState} : any) => (next: any) => (action: any) => {
  next(action);

  if (action.type === MODIFY_RECOMMANDED_TAGS) {
    // payload and states
    const newRecommandedTags: string[] = action.payload;
    const {support}: State = getState();
    const lastTags = support.lastTags;
    const recommandedTags = support.recommandedTags;
    const MAX_LENGTH = 3; // absolute

    if (lastTags.length < newRecommandedTags.length) {
      const newTag = newRecommandedTags[newRecommandedTags.length - 1];
      const foundIndex = recommandedTags.findIndex(prevTag => prevTag === newTag);
      if (foundIndex === -1) { // it means the same thing does not exist, so put it in front and save it
        dispatch(modifySupport({ recommandedTags: [newTag, ...recommandedTags].slice(0, MAX_LENGTH)}));
      }
      else {
        recommandedTags.splice(foundIndex, 1);
        dispatch(modifySupport({ recommandedTags: [newTag, ...recommandedTags]})); // don't need to check the maxCount cuz it will delete
      }
    }
    
  };
};

export const supportMdl = [getSupportMdl, setSupportMdl, modifyMdl, addSemNoDupMdl, deleteSemMdl, modifyRecommandedTagsMdl]; 