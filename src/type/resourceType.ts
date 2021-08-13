import { 
  AvailableCmkWrn, 
  EncryptionMethod, 
  EncryptedDek, Wrn, AvailableWpWrn,
  OkrObjectType } from './availableType';

export type Resource = {
  // finder data
  resourceVersion: "1.0.210804";
  wrn: string;
  dateAdded: number;
  ownerWrn?: string; // resource owner.
  createdByWrn?: string; // the one who created this resource. can be human or wordy internal service 
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
  // wordy policy checker 
  wpWrn?: AvailableWpWrn; // this will be checked first, even before
  // might add dateAdded;
  resoureAvailability?: "Visible" | "NotVisible";
  rejectedReason?: string;
};

export type UserResource = ResourceId & {
  federalProvider: 'google',
  federalId: string;
  lastName: string;
};
// =============
// OKR
// =============

export type OkrLink = ResourceId & {
  targetOwnerWrn: Wrn
};

// Below is the OKR resources
export type MyOkr = ResourceId & {
  id: string; // federalProvider (go) + federalId (will be modified, later. it is only displaying)
  name: string; // dispalying name Jeongwoo Kim@jkim67cloud (but now, I will just use the same id)
  okrSems: number[];
  joinedGroup: Wrn[],
};

export type OkrObject = ResourceId & OkrObjectHeader & {
  // == basic info of the data == //
  initialData: number; // 0 tasks or 77kg of weight
  measuredType: "Speed" | "NumberOfTaskDone"; // 
  speedPerWeek: number; // if NumberOfTaskDone, (getting -0.7 off all the time)
  maxNumberOfTaskDone: number;
  unitPerWeek: string; // kg/week 
  // == comment == // 
  standard: string; // write standard of the goal. one feature = 1.0pt, bug fix 0.2 pt
  // body
  modifableUntil: number;
  objectOrder: number;
  proof: Wrn[]
  comment: Wrn[]
  // tail
  finalScore: number;
};

export type OkrObjectHeader = {
  type: OkrObjectType;
  title: string, // BFR cut til ## (2 hashtag calcualtes your result and put inside)
}

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

