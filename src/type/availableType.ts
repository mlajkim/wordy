// Commented on Aug 8, 2021
// This type is valid

export type AvailableCookies = 'WordyAnonymousAccesstoken' | 'WordyAccesstoken' | 'WordyRefreshtoken' | 'wordyRefreshToken' | 'wordyAccessToken' | 'login' | 'darkLightModeCookie' 
  | "WordyAccessToken";
export type FederalProvider = 'anonymous' | 'google';

// gateway is used for returning W.E
export type Gateway = 
  "iamGateway" | 
  "wcsGateway" | 
  "kmsGateway" | // 
  "cloudTrailGateway" | // Gateway for saving logs. returning proper server state.
  "wesGateway" |
  "watGateway"

export type EncrpytionMethod = "NotEncrypted" | "AES-256-GCM";
export type AvailableCmkWrn = 'wrn::kms:master:env:1:210804'; // version 1 key created on Aug 4