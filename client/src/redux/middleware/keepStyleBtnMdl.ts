// type
import { State } from '../../types';
import { KeepStyleBtnPropType } from '../../frontendTypes';
import { CreateKsbPayload, AlterKsbStatePayload, updateKsb } from '../actions/keepStyleBtnAction';
// action
import { loadKsb, createKsb, alterKsbState } from '../actions/keepStyleBtnAction';
// actionType
import { CLICK_KSB, LOAD_KSB, CREATE_KSB, ALTER_KSB_STATE } from '../actions/keepStyleBtnAction';

export const clickKsbMdl = ({dispatch, getState} : any) => (next: any) => (action: any) => {
  next(action);

  if (action.type === CLICK_KSB) {
    const ksbInfo: KeepStyleBtnPropType = action.payload;

    dispatch(loadKsb(ksbInfo));
  }
};

/**
 * 
 * createKsbMdl first checks if  
 */
export const loadKsbMdl = ({dispatch, getState} : any) => (next: any) => (action: any) => {
  next(action);

  if (action.type === LOAD_KSB) {
    // Available Infos
    const { keepStyleBtn }: State = getState();
    const newKsbInfo: KeepStyleBtnPropType = action.payload;

    // Check if it exists. if Yes, change the state right away. If not, create a new ksb with loading state
    const idx = keepStyleBtn.findIndex(ksb => ksb.btnName === newKsbInfo.btnName);

    if (idx === -1) { // not found
      dispatch(createKsb(newKsbInfo, "idle"))
    }
    else dispatch(alterKsbState(newKsbInfo, "idle"));

    

    // When click happens.
  }
};


export const createKsbMdl = ({dispatch, getState} : any) => (next: any) => (action: any) => {
  next(action);

  if (action.type === CREATE_KSB) {
    // Available Infos
    const { keepStyleBtn }: State = getState();
    const { props, ksbState }: CreateKsbPayload = action.payload;
    
    // Insert (Create) a new Ksb into the array
    dispatch(updateKsb([...keepStyleBtn, { btnName: props.btnName, ksbState }]));

    // When click happens.
  }
};

/**
 * 
 *This alterKsbStateMdl assumes the value already exists
 */
export const alterKsbStateMdl = ({dispatch, getState} : any) => (next: any) => (action: any) => {
  next(action);

  if (action.type === ALTER_KSB_STATE) {
    // Available Infos
    const { keepStyleBtn }: State = getState();
    const { props, ksbState }: AlterKsbStatePayload = action.payload;
    
    // Remove the changing target
    const idx = keepStyleBtn.findIndex(ksb => ksb.btnName === props.btnName);
    keepStyleBtn.splice(idx, 1);

    // Add new! (Because order is not important)
    if (idx !== -1) dispatch(updateKsb([...keepStyleBtn, { btnName: props.btnName, ksbState }]))

  }
};


export const keepStyleBtnMdl = [clickKsbMdl, loadKsbMdl, createKsbMdl, alterKsbStateMdl]; 