//
import { UserState, NewPlayer } from '../../types';

export const UPDATE_SCRABBLY = '[SCRABBLY] Update';
export const AUTHENTICATION = '[SCRABBLY] Authenticate';
export const ASK_FOR_CODE = '[SCRABBLY] Ask for code';
export const CREATE_PLAYER = '[SCRABBLY] Create Player';
export const GAME_START = '[SCRABBLY] Start Game';
export const REFRESH_SCRABBLY = 'SCRABBLY Refresh Scrabbly';

export const updateScrabbly =  (data: object) => {
  return {
    type: UPDATE_SCRABBLY,
    payload: data
  };
};

export const authenticate = (res: any) => {
  return {
    type: AUTHENTICATION,
    payload: res
  };
};

export const askForCode = (hashCode: string) => {
  return {
    type: ASK_FOR_CODE,
    payload: hashCode
  };
};

export const createPlayer = (newPlayer: NewPlayer) => {
  return {
    type: CREATE_PLAYER,
    payload: newPlayer
  };
};

export const gameStart = () => {
  return {
    type: GAME_START
  }
};

export const refreshScrabbly = () => {
  return {
    type: REFRESH_SCRABBLY
  }
};