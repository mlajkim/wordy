import { updateScrabbly } from '../actions/scrabblyAction';
import { AUTHENTICATION } from '../actions/scrabblyAction';

export const authenticateMdl = ({dispatch, getState} : any) => (next: any) => (action: any) => {
  next(action);

  if (action.type === AUTHENTICATION) {
    const { found } = action.payload;

    if(found) dispatch(updateScrabbly({ step: 'gameStart' }));
    else dispatch(updateScrabbly({ step: 'playerNotFound' }));
  }
};


export const scrabblyMdl = [authenticateMdl]; 