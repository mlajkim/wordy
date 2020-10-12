import {FETCHY, FETCHY_FINALLY} from '../actions/apiAction';
import axios from 'axios';
import * as API from '../../API';
import { State, FetchyResponse } from '../../types';

// #FETCH
export const fetchy = ({dispatch, getState} : any) => (next: any) => async (action: any) => {
  next(action);

  if (action.type === FETCHY) {
    const { user }: State = getState();
    const { method, url, payload, onSuccess } = action.payload;

    if (method !== 'get') API.fetchy(method, url, user.ID!, payload);
    else axios.get(`/api/v3/mongo${url}/${user.ID}`, API.getAuthorization())
      .then(({data}) => {
        dispatch(onSuccess(data))
      })
      .catch(err => console.log(err))
  }
};

export const apiMdl = [fetchy]; 