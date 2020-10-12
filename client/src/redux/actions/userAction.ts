import {UserState} from '../../types';
export const UPDATE_USER="[USER] Update";

export const updateUser = (data: UserState) => {
  return {
    type: UPDATE_USER,
    payload: data
  };
};