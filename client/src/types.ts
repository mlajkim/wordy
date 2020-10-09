export type State = {
  dialog: Dialog;
  language: Language;
  languages: Languages;
  isSignedIn: string;
  user: UserState,
  years: Years[];
  words: WordData[],
  snackbar: SnackbarState
}

export type Years = {
  year: number,
  sem: number
}

export type Dialog = {
  isOpen: boolean,
  payload: object
}

export type SnackbarState = {
  isOpen: boolean,
  desc: string,
  type: SnackbarType,
  duration: number
}

export type Languages = {
  addWordLangPref: string;
  data: string[];
  addedWordsCount: number;
  deletedWordsCount: number;
}

export type WordData = {
  year: number,
  sem: number,
  data: Word[]
}

export type Word = {
  _id: string;
  ownerID: string;
  word: string;
  pronun: string;
  meaning: string;
  example: string;
  isPublic: boolean;
  tag: string[];
  language: string;
  dateAdded: string;
  year: number;
  sem: number;
}

export type GoogleRes = {
  googleId: string;
  profileObj: ProfileObj;
};

export type ProfileObj = {
  familyName: string;
  givenName: string;
  email: string;
  imageUrl: string;
}

export type UsersDB = {
  _id: string;
  federalProvider: string;
  federalID: string;
  lastName: string;
  firstName: string;
  email: string;
  imageUrl: string;
  languagePreference: string;
  }

export type Language = 'en' | 'ko' | 'ja';

export type UserState = {
  ID: string;
  lastName: string;
  firstName: string;
  imageUrl: string;
};

export type AddingLangAvailable = 
  {code: 'ko', name: '한국어'} | 
  {code: 'en', name: 'English'} |
  {code: 'ja', name: '日本語'} | 
  {code: 'zh', name: '中文 (简体)'}
  ;

export type FederalProvider = 'google';

// @ SNACKBAR
export type SnackbarType = 'error' | 'warning' | 'info' | 'success'