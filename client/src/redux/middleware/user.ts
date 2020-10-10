import {UPDATE_USER} from '../actions/user';

export const doNothing = ({dispatch} : any) => (next: any) => (action: any) => {
  next(action);

  if (action.type === UPDATE_USER) {
    
  }
}


export const userMdl = [doNothing]; 