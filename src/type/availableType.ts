// Commented on Aug 8, 2021
// This type is valid


export type HttpOnlyCookie = 'WordyAccessToken';
export type AddableLn = "en" | "ko" | "ja"; // newer type, Aug 15, 2021 
export type AvailableCookies = 'WordyAnonymousAccesstoken' | 'WordyAccesstoken' | 'WordyRefreshtoken' | 'wordyRefreshToken' | 'wordyAccessToken' | 'login' | 'darkLightModeCookie' 
export type FederalProvider = 'anonymous' | 'google';
export type EncryptedDek = string;
export type Wrn = `wrn::${string}:${string}:${WrnDatabase}:${string}:${string}`;
export type WrnDatabase = 'mdb' | 'internal'
// gateway is used for returning W.E
export type Gateway = 
  "iamGateway" | 
  "wcsGateway" | 
  "kmsGateway" | // 
  "cloudTrailGateway" | // Gateway for saving logs. returning proper server state.
  "wesGateway" |
  "watGateway";

export type JwtData = {
  wrn: Wrn,
  federalProvider: FederalProvider
  federalId: string;
  ln: AddableLn;
  adminName?: string;
  iat?: number, // iniated at
  exp?: number, //validated unitl
}

export type EncryptionMethod = "NotEncrypted" | "AES-256-GCM";
export type AvailableCmkWrn = 'wrn::kms:master:env:1:210804'; // version 1 key created on Aug 4, 2021

// Wp
export type AvailableWpWrn = 
  "wrn::wp:pre_defined:backend:only_owner:210811" |
  "wrn::wp:pre_defined:backend:only_to_group_members:210811" |
  "wrn::wp:pre_defined:backend:only_to_wordy_member:210811" |
  "wrn::wp:pre_defined:backend:only_to_admin:210811" |
"wrn::wp:pre_defined:backend:dangerously_public:210811";

// identity
export type AssignedIdentity = 
  "wrn::backend_assigned_identity:anonymous_public:internal::" |
  "wrn::backend_assigned_identity:group_member:internal::";

//
// OKR
//

export type OkrObjectType = "Objective" | "KeyResult" | "OkrDailyRoutine";