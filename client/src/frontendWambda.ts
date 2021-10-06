// types
import { WordyEvent, pathFinder } from './type/wordyEventType'
import { AvailableCookies } from './type/availableType'
import { EventType } from './type/wordyEventType'
import { ResourceId, WordPure } from './type/resourceType'
import { WordsChunk, Word, SpecialTag } from './types'
import { checkIfThisDay } from './utils'
// Library
import cookies from 'js-cookie'
import axios from 'axios'
import moment from 'moment'
// Redux
import store from './redux/store'
// Redux Action
import { setSnackbar } from './redux/actions'


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

// Oct 5, 2021
const displayingDate: { displayingName: SpecialTag, days: number }[] = [
  { displayingName: 'today', days: 0 },
  { displayingName: 'yesterday', days: -1 },
  { displayingName: 'fourDays', days: -4 },
  { displayingName: 'weekAgo', days: -7 },
  { displayingName: 'twoWeeksAgo', days: -14 },
  { displayingName: 'threeWeeksAgo', days: -21 },
  { displayingName: 'monthAgo', days: -30 },
]

const getDayOff = (dateAdded: number): number => {
  const oneDayValue = 1000 * 60 * 60 * 24

  const passedTime = moment(dateAdded).valueOf() - moment().valueOf()
  return Math.ceil(passedTime / oneDayValue) 

}

export const filteredSpecialTag = (wordChunk: WordsChunk | undefined): SpecialTag[] => {
  if (typeof wordChunk === 'undefined') return []
  
  // Setting
  const CUT_OFF_UNTIL = -30

  // unique array with getDayoff
  return [...new Set(wordChunk.map(word => getDayOff(word.dateAdded)))]
  .sort((a, b) => b - a)
  .filter(el => el >= CUT_OFF_UNTIL)
  .map(uniqueDate => {
    switch (uniqueDate) {
      case 0: return 'today'
      case -1: return 'yesterday'
      case -4: return 'fourDays'
      case -7: return 'weekAgo'
      case -14: return 'twoWeeksAgo'
      case -21: return 'threeWeeksAgo'
      case -31: return 'monthAgo'
      default: return 'NotCatagorized'
    }
  }) 
  .filter(el => el !== "NotCatagorized") as SpecialTag[]
}

// Oct 5, 2021
export const onlyBiggestThree = (sems: number[]): number[] => sems.sort((a,b)=>b-a).slice(0, 3)
