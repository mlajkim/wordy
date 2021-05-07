
export const ADDABLE_LANGUAGES_LIST: AddableLanguage[] = ['ko', 'en', 'ja', 'zh'];
export type AddableLanguage = 'ko' | 'en' | 'ja' | 'zh';

export type AvailableCookies = 'WordyRefreshToken' | 'wordyRefreshToken' | 'wordyAccessToken' | 'login' | 'darkLightModeCookie' 

// Signin data
export type GoogleResponse = {
  googleId: string
  profileObj: GoogleProfileObject
};

export type GoogleProfileObject = {
  familyName: string;
  givenName: string;
  email: string;
  imageUrl: string;
};