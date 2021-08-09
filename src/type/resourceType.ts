/**
 * 
 * Commented on Aug 7, 2021
 * This type is valid
 */
import { AvailableCmkWrn, EncrpytionMethod } from './availableType';

export type Resource = {
  resourceVersion: "1.0.210804";
  wrn: string;
  ownerWrn?: string; // resource owner.
  // Encrpytion
  encryptionMethod: EncrpytionMethod; //if this undefined? not encrpted
  cmkWrn?: AvailableCmkWrn; // cmk data does not change.
  encryptedDek?: EncryptedDek;
  // Actual data
  ciphertextBlob?: any;
  notEncrpytedData?: any;
  // future feature
  isClientEncrpyted?: boolean; // client key encrypts the encryptedDek after 
};
export type ResourceId = {
  wrn: string;
  ownerWrn: string;
};

// these are all unecrypted data

export type UserResource = ResourceId & {
  federalProvider: 'google',
  federalId: string;
  lastName: string;
}

export type EncryptedDek = string;

export type IdentifierResource = ResourceId & {
  // content
  validRefreshtokens: Refreshtoken[];
  // General Infos that can be blank
  // Wordy Cloud Secured does not collect real names or emaail address, profile image or email.
  nickName: string;
  // familyName: string;
  // givenName: string;
  // email: string;
  // imageUrl: string;
};

export type Refreshtoken = {
  macAddress: string;
  lastUsedLocation: string;
  lastUsedIpAddress: string;
  refrehstoken: string;
};

export type WordResource = {
  language: 'ko' | 'en' | 'ja' | 'zh'
  word: string
  pronun: string
  meaning: string
  example: string
  tags: string[]
};

