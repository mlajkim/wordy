import axios from 'axios';
import cookies from 'js-cookie';
import { FederalProvider } from './types';
import { GoogleRes, ProfileObj } from './types';
// Redux
import store from './redux/store';
import {setSignedIn, setPage, setLanguage, setUser, setYears, offDialog} from './redux/actions';

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

export const setupFront = async (user: any, accessToken: string) => {
  store.dispatch(offDialog())
  store.dispatch(setPage('dashboard'));
  store.dispatch(setSignedIn(true))
  // ONLY FOR THE TESTING QUICKER REASON (BELOW)
  store.dispatch(setPage('list'));
  // ONLY FOR THE TESTING QUICKER REASON (ABOVE)
  store.dispatch(setUser(user._id, user.lastName, user.firstName, user.imageUrl));
  store.dispatch(setLanguage(user.languagePreference))
  const { error, payload } = (await axios.get(`/api/v2/mongo/years/all/${user._id}`, {
    headers: {Authorization: `Bearer ${accessToken}`}
  })).data
  if(!error) store.dispatch(setYears(payload));
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

