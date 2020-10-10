import {UPDATE_WORDS} from '../actions/words';

export const addWords = ({dispatch} : any) => (next: any) => (action: any) => {
  next(action);

  if (action.type === UPDATE_WORDS) {
    
  }
}


export const wordsMdl = [addWords]; 