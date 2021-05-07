import { THROW_EVENT } from '../actions/eventAction';

export const throwEventMdl = ({dispatch, getState} : any) => (next: any) => (action: any) => {
  next(action);

  if (action.type === THROW_EVENT) {
    // Do something
  }
};


export const eventMdl = [throwEventMdl]; 