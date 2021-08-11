// Commented on Aug 8, 2021
// This type is valid

export type AvailableCookies = 'WordyAnonymousAccesstoken' | 'WordyAccesstoken' | 'WordyRefreshtoken' | 'wordyRefreshToken' | 'wordyAccessToken' | 'login' | 'darkLightModeCookie' 
  | "WordyAccessToken";
export type FederalProvider = 'anonymous' | 'google';
export type EncryptedDek = string;
export type Wrn = string;
// gateway is used for returning W.E
export type Gateway = 
  "iamGateway" | 
  "wcsGateway" | 
  "kmsGateway" | // 
  "cloudTrailGateway" | // Gateway for saving logs. returning proper server state.
  "wesGateway" |
  "watGateway"

export type EncryptionMethod = "NotEncrypted" | "AES-256-GCM";
export type AvailableCmkWrn = 'wrn::kms:master:env:1:210804'; // version 1 key created on Aug 4, 2021

// Wp
export type AvailableWpWrn = 
  "wrn::wp:pre_defined:backend:only_me:210811" |
  "wrn::wp:pre_defined:backend:only_to_group_members:210811" |
  "wrn::wp:pre_defined:backend:only_to_group_and_temporary_token:210811" |
  "wrn::wp:pre_defined:backend:only_to_wordy_member:210811" |
  "wrn::wp:pre_defined:backend:only_to_temporary_token:210811" |
  "wrn::wp:pre_defined:backend:only_to_admin:210811" |
  "wrn::wp:pre_defined:backend:dangerously_public:210811";