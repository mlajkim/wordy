import * as actions from './actionTypes';

export const setDialog = (toWhat: string) => {
  return {
    type: actions.SET_DIALOG,
    payload: {
      toWhat
    }
  };
};

export const setPage = (toWhat: string) => {
  return {
    type: actions.SET_PAGE,
    payload: {
      toWhat
    }
  };
};

export const setLanguage = (toWhat: string) => {
  return {
    type: actions.SET_LANGUAGE,
    payload: {
      toWhat
    }
  };
};

export const setSignedIn = (toWhat: boolean) => {
  return {
    type: actions.SET_IS_SIGNED_IN,
    payload: {
      toWhat
    }
  };
};