import { FETCHY, FETCHY3, CONSOLER } from '../actions/apiAction';
import { Fetchy3ActionPayload } from '../actions/apiAction';
import axios from 'axios';
import * as API from '../../API';
import { State } from '../../types';
import { setSnackbar } from '../actions';

// #FETCH
export const fetchy = ({dispatch, getState} : any) => (next: any) => async (action: any) => {
  next(action);

  if (action.type === FETCHY) {
    const { user }: State = getState();
    const { method, url, payload, onSuccess, additionalUrl } = action.payload;
    const extraUrl = typeof additionalUrl === "undefined" ? '' : additionalUrl
    if (method !== 'get') API.fetchy(method, url, user.ID!, payload);
    else axios.get(`/api/v3/mongo${url}/${user.ID}${extraUrl}`, API.getAuthorization())
      .then(({data}) => {
        dispatch(onSuccess(data))
      })
      .catch(err => console.log(err))
  }
};

export const fetchy3 = ({dispatch, getState} : any) => (next: any) => async (action: any) => {
  next(action);

  if (action.type === FETCHY3) {
    // payload
    const { method, url, payload, onSuccess } = action.payload as Fetchy3ActionPayload;
    const { user }: State = getState();
    axios({
      method,
      headers: { Authorization: `Bearer ${API.getAccessToken()}`},
      url: `/api/v3/mongo${url}`,
      data: { 
        ownerID: user.ID, 
        payload: payload ? payload : null
      }
    })
    .then(res => {
      if (onSuccess !== null) dispatch(onSuccess(res.data.payload));
    })
    .catch(err => {
      dispatch(setSnackbar('ERROR WITH FETCHY3 (CHECK CONSOLE)', 'error'))
      console.log(err);
    })
  }
};


export const consoler = ({dispatch, getState} : any) => (next: any) => async (action: any) => {
  next(action);

  if (action.type === CONSOLER) {
    console.log(action.payload);
  }
};

export const apiMdl = [fetchy, fetchy3, consoler]; 