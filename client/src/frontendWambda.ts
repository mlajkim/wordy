import cookies from 'js-cookie';
// Redux
import store from './redux/store';
import {useSelector} from 'react-redux';
// Redux-actions
import { createEvent } from './redux/actions/eventAction';
// types
import { AvailableCookies } from './type/availableType';
import AvailableActions from './type/AvailableActions';


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