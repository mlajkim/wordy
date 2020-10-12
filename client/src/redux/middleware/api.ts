import {FETCHY, FETCHY_FINALLY} from '../actions/api';
import axios from 'axios';
import * as API from '../../API';
import { State } from '../../types';

// #FETCH
export const fetchy = ({dispatch, getState} : any) => (next: any) => async (action: any) => {
  next(action);

  if (action.type === FETCHY) {
    const { user }: State = getState();
    const { method, url, payload } = action.payload;
    // #1 If put, first check if exists, if not, make a new one
    if (method === 'put') {
      const {empty} = await hiddenFetchFunction('get', url, user.ID!);
      if(empty) await hiddenFetchFunction('post', url, user.ID!, null, true);
    }

    // #2 Run
    return await hiddenFetchFunction(method, url, user.ID!, payload);
  }
};

const hiddenFetchFunction = async (
  method: 'post' | 'get' | 'put' | 'delete', url: string, ownerID: string, payload?: object[] | null, isDefault?: boolean
  ) => {
    let additionalUrl = '';
    if((method === 'get' || method === 'delete') && payload) { // only happens when payload exists
      additionalUrl = '/' + JSON.stringify(payload![0]);
    }
   const data = (await axios({
    method,
    headers: { Authorization: `Bearer ${API.getAccessToken()}`},
    url: `/api/v3/mongo${url}/${ownerID}${additionalUrl}`,
    data: { ownerID, payload: payload ? payload : null, isDefault: isDefault ? isDefault : false}
  })).data;

  return data as FetchResult;
}

type FetchResult = {
  status: number,
  message: string,
  empty: boolean,
  length: number,
  data?: any
}


export const apiMdl = [fetchy]; 