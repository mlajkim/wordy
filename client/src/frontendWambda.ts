// types
import { WordyEvent, pathFinder } from './type/wordyEventType';
import { AvailableCookies } from './type/availableType';
import { EventType } from './type/wordyEventType';
import { ResourceId, WordPure } from './type/resourceType';
import { Word } from './types';
// Library
import cookies from 'js-cookie';
import axios from 'axios'
// Redux
import store from './redux/store';
// Redux Action
import { setSnackbar } from './redux/actions';


// event Thrower
export const throwEvent = async (eventType: EventType, requesterInputData?: any, tempAccessToken?: string) => {
  // Prepare for a new event
  // even if bad user modfies requesterWrn, it will be still validated forward, andtherefore it is okay.
  const newEvent: WordyEvent = {
    eventVersion: "1.0.210731",
    eventType,
    requesterInputData,
    tempAccessToken,
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
      store.dispatch(setSnackbar(typeof returnedEvent.serverMessage !== 'undefined' ? returnedEvent.serverMessage: "Denied for unknown reason by server", 'warning', 5));
    }
      
    console.log(returnedEvent); // testing
    return returnedEvent;
  })
  .catch((err) => {
    console.log(err);
    store.dispatch(setSnackbar('Server is rejecting or not responding your request', 'error', 5))
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

// Developed 
type Condition = {
  enableWordSearch?: boolean;
  enableMeaningSearch?: boolean;
  enableExamplesearch?: boolean;
};




export const wordSearchingAlgorithm = (searchData: string, words: Word[], condition: Condition): Word[] => {
  const regex = new RegExp(`.*${searchData.toLowerCase()}.*`);

  return words.filter(word => {
    let found = false;
    if (!found && condition.enableWordSearch && word.word && regex.exec(word.word.toLowerCase()) !== null) found = true;
    if (!found && condition.enableMeaningSearch && word.meaning && regex.exec(word.meaning.toLowerCase()) !== null) found = true;
    if (!found && condition.enableExamplesearch && word.example && regex.exec(word.example.toLowerCase()) !== null) found = true;

    return found;
  })
}

// Sep 21, 2021 
export const convertWordsIntoLegacy = (words: (ResourceId & WordPure)[]): Word[] => {
  return words.map(found => {
    const { dateAdded, objectOrder, isFavorite, sem, language, tag, word, pronun, meaning, example, legacyId, legacyOwnerId } = found;
    return {
      _id: legacyId,
      ownerID: legacyOwnerId,
      order: objectOrder ? objectOrder : 0, 
      dateAdded: dateAdded ? dateAdded : 0, 
      // Shared (the same)
      isFavorite, sem, language, tag, word, pronun, meaning, example,
      // Unused, but defined
      lastReviewed: 0,
      reviewdOn: [0], 
      step: 0,
      seederID: "", 
      packageID: "", 
      isPublic: false,
    }
  });
}
