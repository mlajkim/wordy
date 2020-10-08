export type State = {
  dialog: string;
  language: Language;
  languages: Languages;
  isSignedIn: string;
  user: User,
  years: Array<{year: number, sem: number}>;
  words: WordData[]
}

export type Languages = {
  addWordLangPref: string;
  data: string[];
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

export type Language = 'en' | 'ko' | 'ja';

export type User = {
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