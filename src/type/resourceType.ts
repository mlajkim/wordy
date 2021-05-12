import { AvailableEncryptionAlgorithm } from './availableType';

export type Resource = {
  wrn: string // Plaintext
  ownerWrn: string // Plaintext
  keyWrn: string // Plaintext
  encryptedDek: string // Encrypted data encrpytion key.
  ciphertextBlob: any // Encrypted Data OR plain text data if cmkWrn is blank
};
/**
 * 
 * Identifier Resource
 */

export type IdentifierResource = {
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

/**
It failed to decrypt this data
Used public key number: 7432 8132 4231
Key given name: 단어 암호키 2021년 ㅎㅎ
problem: "key is missing (internal admin error)" | "Key is deleted"
problemDetails:
  key-delete requester public account id: 0000 0000
  deleted Request date: May 5, 2021
  delete duration: After 16 days
  delete Confirmation Date: may 21, 2021

Although the key log is still residing within the database, 
since the keyvalue is deleted internally without backups
your key won't be recovered and any data associated with the key as  well
won't be recovered.
 */

export type KeyResource = {
  // Deletion infromation. When deleted, keyValue of the key will be blank.
  isDeleted: boolean // Key itself does not die for reference.
  deleteRequesterWrn: string;
  deleteRequestedDate: string;
  deleteDuration: string; // "7d" for example
  deleteConfirmationDate: string;
  // General Infos
  keyGivenName: string;
  // Core values
  keyPolicyWrn: string
  isEnabled: boolean // if disabled, you cannot use this key
  encryptionType: AvailableEncryptionAlgorithm
  keyValue: string // 256 bit
};


export type KeyPolicyResource = {
  keyPolicyVesion: "2021-05-10"
  effect: "allow" | "deny"
  principalUserWrns: string[] // user wrn
  action: "kms:*"
  resource: "*"
};



/**
 * 
 * Word Resource
 */

export type WordResource = {
  language: 'ko' | 'en' | 'ja' | 'zh'
  word: string
  pronun: string
  meaning: string
  example: string
  tags: string[]
};

