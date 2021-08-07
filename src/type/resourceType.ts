import { AvailableCmkWrn, EncrpytionMethod } from './availableType';

export type Resource = {
  resourceVersion: "1.0.210804";
  wrn: string;
  ownerWrn?: string; // resource owner.
  // Encrpytion
  encryptionMethod: EncrpytionMethod; //if this undefined? not encrpted
  cmkWrn?: AvailableCmkWrn; // cmk data does not change.
  encryptedDek?: string;
  // Actual data
  ciphertextBlob?: any;
  notEncrpytedData?: any;
  // future feature
  isClientEncrpyted?: boolean; // client key encrypts the encryptedDek after 
};
export type ResourceId = {
  wrn: string;
  ownerWrn: string;
}
// Commented on Aug 4, 2021
// All resource data will be the ABSOLUTE VALUE HERE.

/**
 * 
 * Identifier Resource
 */

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

