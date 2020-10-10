import {UserState} from '../../types';
export const UPDATE_WORDS="[WORDS] Update";

export const updateUser = (data: any) => {
  return {
    type: UPDATE_WORDS,
    payload: data
  };
};