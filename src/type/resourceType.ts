import { AvailableCmkWrn, EncryptionMethod, EncryptedDek, Wrn, AvailableWpWrn } from './availableType';

export type Resource = {
  // finder data
  resourceVersion: "1.0.210804";
  wrn: string;
  dateAdded: number;
  ownerWrn?: string; // resource owner.
  createdByWrn?: string; // the one who created this resource. can be human or wordy internal service 
// wordy policy checker 
  wpWrn: AvailableWpWrn; // this will be checked first, even before
  // Encrpytion
  encryptionMethod: EncryptionMethod; //if this undefined? not encrpted
  cmkWrn?: AvailableCmkWrn; // cmk data does not change.
  encryptedDek?: EncryptedDek;
  // Actual data
  ciphertextBlob?: any;
  notEncrpytedData?: any;
  // future feature
  isClientEncrpyted?: boolean; // client key encrypts the encryptedDek after 
};



// these are all unecrypted data

export type UnencryptedPureResource = 
  UserResource;

export type ResourceId = {
  wrn: string;
  ownerWrn: string;
  resoureAvailability?: "NotVisible";
  rejectedReason?: string;
};

export type UserResource = ResourceId & {
  federalProvider: 'google',
  federalId: string;
  lastName: string;
};

// Below is the OKR resources
export type MyOkr = ResourceId & {
  id: string; // federalProvider (go) + federalId (will be modified, later. it is only displaying)
  name: string; // dispalying name Jeongwoo Kim@jkim67cloud (but now, I will just use the same id)
  okrSems: number[];
  joinedGroup: Wrn[],
};

export type OkrObjective = ResourceId & {
  title: string;
  comment?: Wrn[]
};

export type OkrKeyResult = ResourceId & {
  associatedObjWrn: Wrn, // cut some pounds off.
  modifableUntil: number, // 8 days after creation
  // number, data driven data
  content: string, // BFR cut til ## (2 hashtag calcualtes your result and put inside)
  current: number; //19.9
  method: "speed" | "taskNumber"
  speed?: number; // -0.7
  taskNumber?: number; // 4, then 4 tasks
  unit?: string; // km/h or kg 
  calculatingMethod: string // if it is wordy then, new feature 1pt, else 0.2pt? 
  // or 4 tasks the same. 
  beginProof?: Wrn[] // S3 images that show the initial have 
  // result
  result: number; // this must be auto calculatoable
  score: number, // this must be auto calculatoable
  scoreModifiableUntil: number
  proof?: Wrn[]; // S3 images wrn 
};

export type MyOkrResource = ResourceId & {
  leaderWrn: Wrn,
  members: Wrn[]
};

export type OkrGroup = ResourceId & {
  leaderWrn: Wrn,
  members: Wrn[]
};

export type OkrComment = ResourceId & {
  comment: string,
  belongs?: Wrn; // if it belongs, the comment lives within the comment
  commentedOn: number // July 30, 2021
};


// below is the old resources

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

