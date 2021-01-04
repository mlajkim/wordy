// types
import { WordsChunk, Word, State } from '../../types';

import { updateScrabbly } from '../actions/scrabblyAction';
import { UPDATE_SCRABBLY,
  AUTHENTICATION,
  ASK_FOR_CODE,
  CREATE_PLAYER,
  GAME_START,
  REFRESH_SCRABBLY
} from '../actions/scrabblyAction';

export const authenticateMdl = ({dispatch, getState} : any) => (next: any) => (action: any) => {
  next(action);

  if (action.type === AUTHENTICATION) {
    const { found, data } = action.payload

    if(found) dispatch(updateScrabbly({ step: 'gameStart' }));
    else dispatch(updateScrabbly({ step: 'playerNotFound' }));
  }
};


export const scrabblyMdl = [authenticateMdl]; 