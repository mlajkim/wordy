import * as API from '../../API';
// ACtions
import {
  updateSupport, GET_SUPPORT, SET_SUPPORT, MODIFY_SUPPORT, DELETE_SEM, ADD_SEM_NO_DUPLICATE, MODIFY_RECOMMANDED_TAGS, SWITCH_DARK_LIGHT_MODE, MODIFY_NEW_WORD_ADDING_TYPE
} from '../actions/supportAction';
import { setSupport , modifySupport, switchDarkLightMode } from '../actions/supportAction';
import { fetchy } from '../actions/apiAction';
import { setDialog } from '../actions';
// Types
import { State, FetchyResponse, Support } from '../../types';
import { ToWhichScreenMode } from '../actions/supportAction';

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
    if (!empty) {
      dispatch(updateSupport({ ...data, ownerID: null, __v: null, _id: null }));

      // For Leaving the Token
      dispatch(switchDarkLightMode(data.isDarkMode ? 'dark' : 'light'));
    }
  };
};

// Modify Support helps both modifying front and back.
export const modifyMdl = ({dispatch} : any) => (next: any) => (action: any) => {
  next(action);

  if (action.type === MODIFY_SUPPORT) {
    const { payload, doNotSyncBackend }: any = action.payload;
    // Commented on Jul 26, 2021 
    // No longer syns backend if doNotSyncBackend is true
    if (!doNotSyncBackend) dispatch(fetchy('put', '/supports', [payload]));
    dispatch(updateSupport(payload));
  }
};

export const modifyNewWordAddingTypeMdl = ({dispatch} : any) => (next: any) => (action: any) => {
  next(action);

  if (action.type === MODIFY_NEW_WORD_ADDING_TYPE) {
    const { newWordAddingType }: Support = action.payload;
    dispatch(fetchy('put', '/supports', [{ newWordAddingType }]));
    dispatch(updateSupport({ newWordAddingType }));
    dispatch(setDialog(newWordAddingType === 'one' ? 'AddWordsDialog' : 'MassWordsDialog'));
  }
};

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
    const MAX_LENGTH = 4; // absolute

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


/**
 * Switch light dark mode
 */
export const switchDarkLightModeMdl = ({ dispatch, getState }: any) => (next: any) => (action: any) => {
  next(action);

  if (action.type === SWITCH_DARK_LIGHT_MODE) {
    // Data
    const toWhichScreenMode: ToWhichScreenMode = action.payload;
    const { support }: State = getState();

    // Extract
    // if null, it means they just want to switch, else, switch to the specified one.
    const newScreenMode = toWhichScreenMode === null 
      ? !support.isDarkMode ? 'dark' : 'light'
      : toWhichScreenMode;

    // if mode is specified
    API.updateCookie('darkLightModeCookie', newScreenMode); // Update still creats a new cookie, if not exist

    // Aply for both back and front 
    dispatch(updateSupport({ isDarkMode: newScreenMode === 'dark' }));
    dispatch(fetchy('put', '/supports', [{ isDarkMode: newScreenMode === 'dark' }]));
  };
};

export const supportMdl = [getSupportMdl, setSupportMdl, modifyMdl, modifyNewWordAddingTypeMdl, addSemNoDupMdl, deleteSemMdl, modifyRecommandedTagsMdl, switchDarkLightModeMdl]; 