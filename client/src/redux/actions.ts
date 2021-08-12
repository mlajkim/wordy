import { SnackbarType, DialogType } from '../types';
import * as actions from './actionTypes';

// @ DIALOG
export const setDialog = (type: DialogType, payload?: object) => {
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

export const setLanguages = (toWhat: string[]) => {
  return {
    type: actions.SET_LANGUAGES,
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

// @ SNACKBAR
export const setSnackbar = (desc: string, type?: SnackbarType, duration?: number) => {
  if (!duration && (type === "warning" || type === "error"))
    duration = 5; // by default;
  return {
    type: actions.SET_SNACKBAR,
    payload: {
      desc, type, duration
    }
  }
}

export const offSnackbar = () => {return { type: actions.OFF_SNACKBAR }}