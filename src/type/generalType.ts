
export const ADDABLE_LANGUAGES_LIST: AddableLanguage[] = ['ko', 'en', 'ja', 'zh'];
export type AddableLanguage = 'ko' | 'en' | 'ja' | 'zh';

// Signin data
export type GoogleResponse = {
  googleId: string
  profileObj: GoogleProfileObject
  tokenId: string // same as the id_token of GoogleSigninTokenObj
  tokenObj: GoogleSigninTokenObj
};

export type GoogleProfileObject = {
  familyName: string;
  givenName: string;
  email: string;
  imageUrl: string;
};

export type GoogleSigninTokenObj = {
  access_token: string
  expires_at: number
  expires_in: number
  first_issued_at: number
  id_token: string
  idpId: "google" | string
  login_hint: string
  scope: string
  token_type: "Bearer" | string
};