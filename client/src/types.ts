export type State = {
  dialog: string;
  language: Language;
  isSignedIn: string;
  user: User
}

export type Language = 'en' | 'ko' | 'ja';

export type User = {
  ID: string;
  lastName: string;
  firstName: string;
  imageUrl: string;
}