import {SET_SUPPORT, updateSupport} from '../actions/support';

export const setSupport = ({dispatch} : any) => (next: any) => (action: any) => {
  next(action);

  if (action.type === SET_SUPPORT) {
    updateSupport(action.payload);
  }
}


export const supportMdl = [setSupport]; 