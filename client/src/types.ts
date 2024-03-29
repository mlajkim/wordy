import { AvailableCookies, Version } from './type/availableType'
import { KeepStyleBtnProperty } from'./frontendTypes'
import { LegacyPureWord } from './type/legacyType'

export type State = {
  okrLoading: OkrLoading;
  dialog: Dialog;
  language: Language;
  support: Support;
  user: UserState,
  years: Years[];
  words: WordsChunk[],
  snackbar: SnackbarState,
  scrabbly: Scrabbly;
  keepStyleBtn: KeepStyleBtnProperty[];
  page: string;
};

export type OkrLoading = {
  isLoading: boolean;
  foundData: any;
}

export type Scrabbly = {
  step: 'initialize' | 'playerNotFound' | 'gameStart' | 'waiting';
}

export type Fetchy3Response = {
  empty: boolean,
  payload: any
};

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
  payload?: object
}

export type DialogType = 'LoginDialog' | 'SignUpDialog' | 'AddWordsDialog' | 'EditWord' |
  'MassWordsDialog' | 'ConfirmDelete' | 'Warning401' | 'Warning403' | 'ShortcutDialog' | 'SettingDialog' |
  // okr below
  'EditOkrObject' |
  'GroupDialog' |
  'CreateOkrObject' | "PatchNote";

export type SnackbarState = {
  isOpen: boolean,
  desc: string,
  type: SnackbarType,
  duration: number
}

export type Support = {
  version: Version
  isBeta: boolean;
  versionDate: string;
  addWordLangPref: AddableLang;
  status: 'admin' | null;
  newWordCnt: number;
  deletedWordCnt: number;
  sems: number[];
  lastTags: string[];
  recommandedTags: string[];
  newWordAddingType: NewWordAddingType;
  wordOrderPref: AscDescType;
  yearOrderPref: AscDescType,
  wordDisplayPref: 'wordcard' | 'list';
  isDarkMode: boolean;
  // ! Version related
  lastReadVersion: Version
  // Personal Setting
  extendedSearchBar: boolean;
  isYearQuadrantEnabled: boolean;
  displayingLnUserPref: AddableLang[];
  languageDetectionEnabled: boolean;
  highlightSearched: boolean;
  // Search Setting
  searchOnlyDownloaded: boolean; // if truned in, it only downloads 
  // Search Data
  searchData: string;
  searchLoading: boolean;
  searchingBegins: boolean;
  // Reviews
  mixedSem: number;
  maxStep: number,
  steps: number[],
  // old
  addedWordsCount: number;
  deletedWordsCount: number;
};

export type CookiesAvailable = AvailableCookies;
export type AscDescType = 'asc' | 'desc';

export type NewWordAddingType = 'one' | 'mass';

// 追加できる言語
export type AddableLang = 'ko' | 'en' | 'ja' | 'zh';
// 翻訳されてる言語
export type DisplayingLn = Language;
export type Language = 'en' | 'ko' | 'ja';

export type Word = LegacyPureWord;

export type GoogleRes = {
  googleId: string;
  profileObj: ProfileObj;
  tokenId: string;
};

export type ProfileObj = {
  familyName: string;
  givenName: string;
  email: string;
  imageUrl: string;
};

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
};

export type UserState = {
  isSignedIn: boolean
  languagePreference?: Language 
  ID?: string
  lastName?: string
  firstName?: string
  imageUrl?: string
};

export type AddingLangAvailable = 
  {code: 'ko', name: '한국어'} | 
  {code: 'en', name: 'English'} |
  {code: 'ja', name: '日本語'} | 
  {code: 'zh', name: '中文 (简体)'}
  ;

export type FederalProvider = 'google';

// @ SNACKBAR
export type SnackbarType = 'error' | 'warning' | 'info' | 'success';

export type NewPlayer = {
  nickName: string,
  
};

export type SpecialTag = '' | 'all' | 'favorite' | 'today' | 'fourDays' | 'yesterday' | 'weekAgo' | 'twoWeeksAgo' | 'threeWeeksAgo' | 'monthAgo';
