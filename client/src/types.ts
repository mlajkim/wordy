export type State = {
  dialog: string;
  language: Language;
}

export type Language = 'en' | 'ko' | 'ja';

export type User = {
  lastName: string;
  firstName: string;
  imageUrl: string;
}