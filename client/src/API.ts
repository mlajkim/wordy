import axios from 'axios';
import cookies from 'js-cookie';
import { FederalProvider, UsersDB, NewWordAddingType, GoogleRes, ProfileObj } from './types';
// Redux
import store from './redux/store';
import {
  setSignedIn, setPage, setLanguage, setUser, 
  setYears, offDialog, setAddedWordsCount, setDeletedWordsCount, setNewWordAddingType, setDialog
} from './redux/actions';

export const handleUserChangeDB = (accessToken: string, payload: any) => {
  axios.put(`/api/v2/mongo/users`, {payload: {...payload}}, {
    headers: {Authorization: `Bearer ${accessToken}`}
  })
}

// @ AUTHENTICATION 
export const generateAccessToken = async (federalProvider: FederalProvider, federalID: string) => {
  const data = (await axios.post(`/api/v2/auth/login`, {
    federalProvider, federalID
  })).data;

  return {
    error: data.error as boolean, 
    accessToken: data.payload.accessToken as string, 
    expires: data.payload.expires as number
  }
}

export const handleEverySignIn = async (accessToken: string, googleRes?: GoogleRes, languagePreference?: string) => {
  let { error, payload } = await checkIfUserExists(accessToken);
  if( error && !googleRes) return; // no user requires profile to add a new user. 
  if (error) {
    // Create a user
    const profileObj: ProfileObj = googleRes!.profileObj;
    let data = (await axios.post(`/api/v2/mongo/users`, {payload: {
      federalProvider: 'google',
      federalID: googleRes?.googleId,
      lastName: profileObj.familyName,
      firstName: profileObj.givenName,
      email: profileObj.email,
      imageUrl: profileObj.imageUrl,
      languagePreference: languagePreference ? languagePreference : 'en'
    }}, getAuthorization())).data;

    if(data.error) return;
    payload = data.payload;
  };
  setupFront(payload, accessToken);
}

export const checkIfUserExists = async (accessToken: string) => {
  const data =  (await axios.get(`/api/v2/mongo/users`, {
    headers: {Authorization: `Bearer ${accessToken}`}
  })).data;

  if(data.error) return {error: true, payload: null};
  else return {error: false, payload: data.payload};
}

export const setupFront = async (user: UsersDB, accessToken: string) => {
  store.dispatch(offDialog())
  store.dispatch(setPage('dashboard'));
  store.dispatch(setSignedIn(true))
  // ONLY FOR THE TESTING QUICKER REASON (BELOW)
  store.dispatch(setPage('list'));
  // ONLY FOR THE TESTING QUICKER REASON (ABOVE)
  store.dispatch(setUser(user._id, user.lastName, user.firstName, user.imageUrl));
  store.dispatch(setLanguage(user.languagePreference))
  
  // Handles 'years' collection
  const { error, payload } = (await axios.get(`/api/v2/mongo/years/all/${user._id}`, {
    headers: {Authorization: `Bearer ${accessToken}`}
  })).data
  if(!error) store.dispatch(setYears(payload));

  // Handles users  languages collection
  let languagesRes = (await axios.get(`/api/v2/mongo/languages/${user._id}`, getAuthorization())).data;
  if(languagesRes.error) { // does not exist
    languagesRes = (await axios.post(`/api/v2/mongo/languages`, {
      // default english, stil adding data null
      payload: { 
        ownerID: user._id, firstName: user.firstName, addWordLangPref: 'en', data: [], 
        addedWordsCount: 0, deletedWordsCount: 0, newWordAddingType: 'one'
      }
    }, getAuthorization())).data;
  } else { // if exists
    // Check to make sure it exists (New feature, modification required)
    // ***Data Checking***
    if(languagesRes.payload.addedWordsCount === undefined) {
      languagesRes.payload.addedWordsCount = 0;
      axios.put(`/api/v2/mongo/languages/${user._id}`, {payload: {
        addedWordsCount: 0
      }}, getAuthorization())
    }
    if(languagesRes.payload.deletedWordsCount === undefined) {
      languagesRes.payload.deletedWordsCount = 0;
      axios.put(`/api/v2/mongo/languages/${user._id}`, 
      {payload: { deletedWordsCount: 0 }}, 
      getAuthorization())
    }
    if(languagesRes.payload.newWordAddingType === undefined) {
      languagesRes.payload.newWordAddingType = 'one'
    }
  }
  // ..Set up the front
  store.dispatch(setAddedWordsCount(languagesRes.payload.addedWordsCount));
  store.dispatch(setDeletedWordsCount(languagesRes.payload.deletedWordsCount));
  store.dispatch(setNewWordAddingType(languagesRes.payload.newWordAddingType))
}

export const getAuthorization = () => {
  return {
    headers: {
      Authorization: `Bearer ${cookies.get('login')}`
    }
  }
}

export const getAccessToken = () => {
  return cookies.get('login') as string
}

export const addToken = (name: string, data: any, expires: number) => {
  cookies.set(name, data, {expires});
}

// @ SIGN OUT / FORCE EXPIRING
export const killCookie = (what: string) =>  {
  cookies.remove('login');
}

// @ Preferences (Old Languages)
export const handleNewWordAddingType = (userID: string, type: NewWordAddingType) => {
  axios.put(`/api/v2/mongo/languages/${userID}`, {payload: {
    newWordAddingType: type
  }}, getAuthorization())
  store.dispatch(setDialog('AddWordsDialog'));
  store.dispatch(setNewWordAddingType('one'));
}

