import cookies from 'js-cookie';
import axios from 'axios'
import { WordyEvent } from './type/wordyEventType';
import { pathFinder } from './type/wordyEventType';
// Redux
import store from './redux/store';
// Redux-actions
import { createEvent } from './redux/actions/eventAction';
// types
import { AvailableCookies } from './type/availableType';
import { AvailableActions } from './type/AvailableActions';
import { EventType } from './type/wordyEventType';
import { setSnackbar } from './redux/actions';

// event Thrower
export const throwEvent = async (eventType: EventType) => {
  const response = await axios.post('/apigateway' + pathFinder(eventType));
  if (!response) store.dispatch(setSnackbar("Backend not responding..", "error"));
  else return response.data as WordyEvent
}

// 2021 June Latest version of requesting to API calls of apigateway of Wordy-cloud!!
export const request = (action: AvailableActions, payload: object | object[]) => {
  const refinedPayload: object[] = typeof payload === 'object' ? [payload] : payload;

  store.dispatch(createEvent(action, refinedPayload)); 
};

// Cookies API
export const readCookie = (cookieName: AvailableCookies) => {
  const readCookie = cookies.get(cookieName);
  return readCookie ? readCookie : ""
};

export const addOrUpdateCookie = (cookieName: AvailableCookies, data: any, expires?: number) => {
  cookies.set(cookieName, data, { expires });
};

