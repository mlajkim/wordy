import * as actions from './actionTypes';

export const setDialog = (toWhat: string) => {
  return {
    type: actions.SET_DIALOG,
    payload: {
      toWhat
    }
  };
};