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
export const throwEvent = async (eventType: EventType, requesterInputData?: any) => {
  // Prepare for a new event
  const newEvent: WordyEvent = {
    eventVersion: "1.0.210731",
    eventType,
    requesterInputData,
    requesterWrn: "wrn::user:admin:mdb:00001111" // this is testing and shoudl not haapen for future use.
  };

  // loads the requester data if it exists
  const response = await axios({
    method: "post",
    headers: { Authorization: `Bearer dump authorization code`},
    url: '/apigateway' + pathFinder(eventType),
    data: newEvent
  })
  .then((res) => {
    const returnedEvent: WordyEvent = res.data;

    if (returnedEvent.serverResponse === 'Denied') 
      store.dispatch(setSnackbar(typeof returnedEvent.serverMessage !== 'undefined' ? returnedEvent.serverMessage: "Denied for unknown reason by server", 'warning'))
    
    return returnedEvent;
  })
  .catch(() => {
    store.dispatch(setSnackbar('Server is rejecting or unresponsible of your request', 'error'))
    newEvent.serverResponse = "Denied";
    return newEvent;
  });

  return response;
}; // end of throwEvent

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

