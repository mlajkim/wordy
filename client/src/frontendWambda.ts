// types
import { WordyEvent, pathFinder } from './type/wordyEventType'
import { AvailableCookies } from './type/availableType'
import { EventType } from './type/wordyEventType'
import { ResourceId, WordPure, WordPureEditable } from './type/resourceType'
import { WordsChunk, Word, SpecialTag, GoogleRes } from './types'
import { AddableLanguage } from './type/generalType'
// Library
import cookies from 'js-cookie'
import axios from 'axios'
import moment from 'moment'
import { knuthShuffle } from 'knuth-shuffle'
// Redux
import store from './redux/store'
// Redux Action
import { setSnackbar } from './redux/actions'
import { LegacyPureWord } from './type/legacyType'


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

const getDayOff = (dateAdded: number): number => {
  const oneDayValue = 1000 * 60 * 60 * 24
  
  const passedTime = moment(dateAdded).valueOf() - moment().startOf('day').valueOf() - 1
  return Math.floor(passedTime / oneDayValue) 

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

// ! October, 2021 
export const orderFirst = (
  orderThisFirst: AddableLanguage, array: AddableLanguage[]
): AddableLanguage[] => {
  const index = array.findIndex(el => el === orderThisFirst)

  if (index === -1) return [orderThisFirst, ...array]
  
  const newArray = array.slice()
  newArray.splice(index, 1)
  return [orderThisFirst, ...newArray]
}

// ! October, 2021
export const shuffleKnuckle = (arr: any[]): any[] => knuthShuffle(arr)

// ! October, 2021
// ? For Google One Tap Signin
export const cvtOneTapIntoGoogleRes = (
  oneTapData: any
): GoogleRes => {
  const { family_name, given_name, email, picture, sub } = oneTapData
  const googleId = sub

  return {
    googleId: googleId, 
    profileObj: {
      familyName: family_name,
      givenName: given_name,
      email: email,
      imageUrl: picture,
    },
    tokenId: ""
  }
}


// Sep 21, 2021 
export const convertWordsIntoLegacy = (words: (ResourceId & WordPure)[]): Word[] => {
  return words.map(found => {
    const { dateAdded, objectOrder, isFavorite, sem, language, tags, word, pronun, meaning, example, wrn, isEncrypted, imageWrn, ownerWrn, legacyId } = found;
    return {
      wrn, imageWrn, ownerWrn, legacyId: legacyId ? legacyId : "",
      wpWrn: "wrn::wp:pre_defined:backend:only_owner:210811",
      isEncrypted,
      _id: "",
      ownerID: "",
      order: objectOrder ? objectOrder : 0, 
      dateAdded: dateAdded ? dateAdded : 0, 
      // Shared (the same)
      isFavorite, sem, language, tag: tags, word, pronun, meaning, example,
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

// ! October, 2021
export const convertLegacyWordIntoPureWord = (editedData: WordPureEditable, originalData: LegacyPureWord): ResourceId & WordPure => {
  const { wrn, ownerWrn, dateAdded, order, wpWrn, legacyId, isEncrypted } = originalData

  return {
    wrn, ownerWrn, dateAdded,
    objectOrder: order, wpWrn,
    isEncrypted, legacyId: legacyId ? legacyId : "",
    ...editedData
  }
} 


