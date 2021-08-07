

export type AvailableCookies = 'WordyAnonymousAccesstoken' | 'WordyAccesstoken' | 'WordyRefreshtoken' | 'wordyRefreshToken' | 'wordyAccessToken' | 'login' | 'darkLightModeCookie' 
export type AvailableFederalProvider = 'anonymous' | 'google';
export type Gateway = "iamGateway" | "wcsGateway" | "kmsGateway" | "mongoGateway" | "cloudTrailGateway" | "wesGateway";

export type AvailableCmkWrn = 'wrn::kms:master:env:1:210804'; // version 1 key created on Aug 4

export type AvailableEncryptionAlgorithm = 'AES-256-GCM'; // Follows AWS using symmetric encryption type with G
