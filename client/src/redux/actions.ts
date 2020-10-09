import { Word, SnackbarType } from '../types';
import * as actions from './actionTypes';

// @ DIALOG
export const setDialog = (type: string, payload?: object) => {
  return {
    type: actions.SET_DIALOG,
    payload: { type, payload }
  };
};

export const offDialog = () => {return { type: actions.OFF_DIALOG }};

//
export const setPage = (toWhat: string) => {
  return {
    type: actions.SET_PAGE,
    payload: { toWhat }
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

// @ YEARS
export const setYears = (addWhat: object[]) => {
  return {
    type: actions.SET_YEARS,
    payload: {
      addWhat
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

export const deleteOneYear = (year: number, sem: number) => {
  return {
    type: actions.DELETE_ONE_YEAR, payload: { year, sem }
  }
};

// @ WORDS
export const addChunkIntoData = (insertWhat: {year: number, sem: number, data: object[]}) => {
  return {
    type: actions.ADD_CHUNK_INTO_DATA,
    payload: {
      ...insertWhat
    }
  }
};

export const addOneWordIntoData = ( word: Word ) => {
  return {
    type: actions.ADD_ONE_WORD_INTO_DATA,
    payload: { word }
  }
};

export const deleteOneWordFromData = (wordID: string, year: number, sem: number) => {
  return {
    type: actions.DELETE_ONE_WORD_FROM_DATA,
    payload: { wordID, year, sem }
  }
}

// @ SNACKBAR
export const setSnackbar = (desc: string, type?: SnackbarType, duration?: number) => {
  return {
    type: actions.SET_SNACKBAR,
    payload: {
      desc, type, duration
    }
  }
}

export const offSnackbar = () => {return { type: actions.OFF_SNACKBAR }}