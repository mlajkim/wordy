import { POST_EVENT } from '../actions/eventAction';

export const postEventMdl = ({dispatch, getState} : any) => (next: any) => (action: any) => {
  next(action);

  if (action.type === POST_EVENT) {
    // Do something
  }
};


export const eventMdl = [postEventMdl]; 