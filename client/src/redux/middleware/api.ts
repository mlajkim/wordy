import {FETCHY} from '../actions/api';
import axios from 'axios';
import * as API from '../../API';

// #FETCH
export const fetchy = ({dispatch, getState} : any) => (next: any) => (action: any) => {
  next(action);

  if (action.type === FETCHY) {
    const { method, url, payload } = action.payload;
    axios({
      method,
      headers: { Authorization: `Bearer ${API.getAccessToken()}`},
      url: `/api/v3/mongo${url}`,
      data: payload ? {payload} : null
    })
    .then(res => res)
    .catch(err => err)
    
  }
};


export const apiMdl = [fetchy]; 