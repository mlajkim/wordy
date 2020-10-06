import axios from 'axios';
import Cookies from 'js-cookie';
// Redux
import store from '../../redux/store';
import {setDialog, setSignedIn, setPage, setLanguage, setUser, setYears} from '../../redux/actions';

type GoogleRes = {
  googleId: string;
  profileObj: {
    familyName: string;
    givenName: string;
    email: string;
    imageUrl: string;
  }
};

type User = {
  _id: string;
  federalProvider: string;
  federalID: string,
  lastName: string,
  firstName: string,
  email: string,
  imageUrl: string,
  languagePreference: string
};

export const handleSignInWithAccessToken = (accessToken: string) => {
  // validate access token
  handleGettingUserIntoFront(accessToken);
}

// @MAIN
export const handleSignIn = async ({googleId, profileObj}: GoogleRes) => {
  // Get access token & Refresh token
  const {accessToken, expires} = (await axios.post(`/api/v2/auth/login`, {
    federalProvider: 'google',
    federalID: googleId
  })).data.payload;

  // Save token securely
  Cookies.set('login', accessToken, {expires});

  // Fetch meanwhile
  handleGettingUserIntoFront(accessToken);
  
};

const handleGettingUserIntoFront = async (accessToken: string) => {
  store.dispatch(setDialog(''))
  store.dispatch(setPage('dashboard'))
  // This is for the quick testing
  store.dispatch(setPage('list'));// delete this later
  // DELETE THE "ABOVE" LATER
  store.dispatch(setSignedIn(true))

  const user: User =  (await axios.get(`/api/v2/mongo/users`, {
    headers: {Authorization: `Bearer ${accessToken}`}
  })).data.payload;
  // Ah, these are the user-sync-preference
  store.dispatch(setUser(user._id, user.lastName, user.firstName, user.imageUrl));
  store.dispatch(setLanguage(user.languagePreference))
  const { data } = await axios.get(`/api/v2/mongo/years/all/${user._id}`, {
    headers: {Authorization: `Bearer ${accessToken}`}
  })
  store.dispatch(setYears(data.payload));
}

