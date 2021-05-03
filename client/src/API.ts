import axios from 'axios';
import cookies from 'js-cookie';
import { FetchyResponse, UsersDB, GoogleRes, ProfileObj, UserState } from './types';
// Redux
import store from './redux/store';
import { setPage, setLanguage, setYears, offDialog } from './redux/actions';
import { updateUser } from './redux/actions/userAction';
import { getSupport } from './redux/actions/supportAction';
// Types
import { CookiesAvailable } from './types';

export const signIn = (version: number) => {
  // Check if refresh token exists
  const ReadWordyRefreshToken = readCookie("wordyRefreshToken");
  
  // if nothing found, it is considered signed out. 
  // Also making sure that Google Signin API has 'signout' turned off too. (For now, i will skip this process)
  if (ReadWordyRefreshToken.length === 0) return;

  
};

export const fetchy = (
  method: 'post' | 'get' | 'put' | 'delete', url: string, ownerID: string, payload?: object[] | null, isDefault?: boolean
  ): FetchyResponse => {
    // let additionalUrl = '';
    // if((method === 'get' || method === 'delete') && payload) { // only happens when payload exists
    //   additionalUrl = '/' + JSON.stringify(payload![0]);
    // }
  axios({
    method,
    headers: { Authorization: `Bearer ${getAccessToken()}`},
    url: `/api/v3/mongo${url}/${ownerID}`,
    data: { ownerID, payload: payload ? payload : null, isDefault: isDefault ? isDefault : false}
  })
  .then(res => {return res.data})

  // by default
  return {
    empty: true,
    length: 0
  }
};


//################### V3 Above

export const handleUserChangeDB = (accessToken: string, payload: any) => {
  axios.put(`/api/v2/mongo/users`, {payload: {...payload}}, {
    headers: {Authorization: `Bearer ${accessToken}`}
  })
}

// @ AUTHENTICATION 
export const generateAccessToken = async ({googleId, profileObj}: GoogleRes) => {
  const {familyName, givenName, email} = profileObj;
  const data = (await axios.post(`/api/v2/auth/login`, {
    federalProvider: 'google', federalID: googleId, firstName: givenName, lastName: familyName, email
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
  
  store.dispatch(updateUser({
    isSignedIn: true,
    ID: user._id,
    lastName: user.lastName,
    firstName: user.firstName,
    imageUrl: user.imageUrl,
    dateAdded: user.dateAdded
  } as UserState))
  store.dispatch(setLanguage(user.languagePreference))
  // ONLY FOR THE TESTING QUICKER REASON (BELOW)
  store.dispatch(setPage('list'));
  // ONLY FOR THE TESTING QUICKER REASON (ABOVE)
  
  // Handles 'years' collection
  const { error, payload } = (await axios.get(`/api/v2/mongo/years/all/${user._id}`, {
    headers: {Authorization: `Bearer ${accessToken}`}
  })).data
  if(!error) store.dispatch(setYears(payload));

  // ..Set up the front
  store.dispatch(getSupport());
}

export const getAuthorization = () => {
  return {
    headers: {
      Authorization: `Bearer ${cookies.get('login')}`
    }
  }
}

// Cookies API
export const readCookie = (cookieName: CookiesAvailable) => {
  return cookies.get(cookieName) as string;
};

export const addCookie = (cookieName: CookiesAvailable, data: any, expires?: number) => {
  cookies.set(cookieName, data, { expires });
};

export const updateCookie = (cookieName: CookiesAvailable, newData: any) => {
  cookies.set(cookieName, newData);
};

// @ KillCookie
export const killCookie = (cookieName: CookiesAvailable) =>  {
  cookies.remove(cookieName);
};

export const getAccessToken = () => {
  return cookies.get('login') as string
}

export const addToken = (name: string, data: any, expires: number) => {
  cookies.set(name, data, {expires});
}

// handle incapable numbers given
export const checkValidDataOfExtraYear = (year: string, sem: string, from: number, to: number): boolean => {
  if(!parseInt(year) || ! parseInt(sem)) return false;
  // handles year & sem
  const yearInt = parseInt (year);
  const semInt = parseInt (sem);
  if (yearInt < from || yearInt > to) return false; // if NOT between from ~ to
  if (semInt < 1 || semInt > 4) return false;

  return true;
}

