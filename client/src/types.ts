export type State = {
  dialog: string;
  language: Language;
  languages: Languages;
  isSignedIn: string;
  user: User
}

export type Languages = {
  addWordLangPref: string;
  data: string[];
}

export type Language = 'en' | 'ko' | 'ja';

export type User = {
  ID: string;
  lastName: string;
  firstName: string;
  imageUrl: string;
}