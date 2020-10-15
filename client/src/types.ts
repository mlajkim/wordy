import {Moment} from 'moment';

export type State = {
  dialog: Dialog;
  language: Language;
  support: Support;
  user: UserState,
  years: Years[];
  words: WordsChunk[],
  snackbar: SnackbarState
}

export type FetchyResponse = {
  empty: boolean,
  length?: number,
  data?: any
};

export type WordsChunk = Word[];

export type Years = {
  year: number,
  sem: number
}

export type Dialog = {
  isOpen: boolean,
  type: DialogType,
  payload: object
}

export type DialogType = 'LoginDialog' | 'SignUpDialog' | 'AddWordsDialog' | 'EditWord' |
  'MassWordsDialog' | 'ConfirmDelete' | 'Warning401' | 'Warning403';

export type SnackbarState = {
  isOpen: boolean,
  desc: string,
  type: SnackbarType,
  duration: number
}

export type Support = {
  version: string;
  addWordLangPref: AddableLang;
  newWordCnt: number;
  deletedWordCnt: number;
  sems: number[];
  newWordAddingType: NewWordAddingType;
  // old
  addedWordsCount: number;
  deletedWordsCount: number;
  orderPref: AddableLang[]
}

export type NewWordAddingType = 'one' | 'mass';

// 追加できる言語
export type AddableLang = 'ko' | 'en' | 'ja' | 'zh';
// 翻訳されてる言語
export type Language = 'en' | 'ko' | 'ja';

export type Word = {
  _id: string,
  ownerID: string,
  order: number, 
  dateAdded: number, 
  lastReviewed: string,
  review: number[], 
  seederID: string, 
  packageID: string, 
  isFavorite: boolean,
  sem: number,
  language: string,
  tag: string[],
  word: string,
  pronun: string,
  meaning: string,
  example: string,
  isPublic: boolean,
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
  dateAdded: number;
  federalProvider: string;
  federalID: string;
  lastName: string;
  firstName: string;
  email: string;
  imageUrl: string;
  languagePreference: string;
  }



export type UserState = {
  isSignedIn: boolean;
  ID?: string;
  lastName?: string;
  firstName?: string;
  imageUrl?: string;
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