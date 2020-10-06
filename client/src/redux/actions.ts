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

export const setUser = (_id: string, lastName: string, firstName: string, imageUrl: string) => {
  return {
    type: actions.SET_USER,
    payload: {
      ID: _id, lastName, firstName, imageUrl
    }
  };
};

export const setLanguages = (toWhat: string[]) => {
  return {
    type: actions.SET_LANGUAGES,
    payload: {
      toWhat
    }
  };
}

export const setAddWordLangPref = (toWhat: string) => {
  return {
    type: actions.SET_ADD_WORD_LANG_PREF,
    payload: {
      toWhat
    }
  };
}

export const addYears = (addWhat: {year: number, sem: number}) => {
  return {
    type: actions.ADD_YEARS,
    payload: {
      ...addWhat
    }
  };
}