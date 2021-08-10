import cookies from 'js-cookie';
import axios from 'axios'
import { WordyEvent } from './type/wordyEventType';
import { pathFinder } from './type/wordyEventType';
// Redux
import store from './redux/store';
// types
import { AvailableCookies } from './type/availableType';
import { EventType } from './type/wordyEventType';
import { setSnackbar } from './redux/actions';

// event Thrower
export const throwEvent = async (eventType: EventType, requesterInputData?: any) => {
  // Prepare for a new event
  // even if bad user modfies requesterWrn, it will be still validated forward, andtherefore it is okay.
  const newEvent: WordyEvent = {
    eventVersion: "1.0.210731",
    eventType,
    requesterInputData,
  };

  // loads the requester data if it exists
  const returningEvent = await axios({
    method: "post",
    headers: { Authorization: `Bearer dump authorization code`},
    url: '/apigateway' + pathFinder(eventType),
    data: newEvent
  })
  .then((res) => {
    const returnedEvent: WordyEvent = res.data;

    if (returnedEvent.serverResponse === 'Denied') {
      store.dispatch(setSnackbar(typeof returnedEvent.serverMessage !== 'undefined' ? returnedEvent.serverMessage: "Denied for unknown reason by server", 'warning', 5))
      console.log(returnedEvent);
    }
      
    
    return returnedEvent;
  })
  .catch(() => {
    store.dispatch(setSnackbar('Server is rejecting or unresponsible of your request', 'error'))
    newEvent.serverResponse = "Denied";
    return newEvent;
  });

  return returningEvent;
}; // end of throwEvent

// Cookies API
export const readCookie = (cookieName: AvailableCookies) => {
  const readCookie = cookies.get(cookieName);
  return readCookie ? readCookie : ""
};

export const addOrUpdateCookie = (cookieName: AvailableCookies, data: any, expires?: number) => {
  cookies.set(cookieName, data, { expires });
};

