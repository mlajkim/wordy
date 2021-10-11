// Commented on Aug 7, 2021
// this is validated type value
// This data is what backend sends

// Type
import { UserPure, MyOkrPure, OkrObjectHeader, OkrObjectPure, ResourceId,
  OkrContainerPure, WordPure, WordPureBasic
} from '../type/resourceType'
import { 
  AvailableWpWrn,
  FederalProvider
} from './availableType'
import Wrn from './wrn'

export type GeneralDeletionPayload = {
  totalCnt: number // total target numbers
  deletedCnt: number // actually deleted
  noPermissionCnt: number // not enough permission to delete
  failedCnt: number // else (such as mongo DB not listening..)
  totalWrns: Wrn[]
  deletedWrns: Wrn[]
  noPermissionWrns: Wrn[]
  failedWrns: Wrn[]
}

// ===============
// User service
// ===============

// word:DELETE_WORDS 
export type WordDeleteWordsInput = { deletingWrns: Wrn[] }
export type WordDeleteWordsPayload = GeneralDeletionPayload

// word:EDIT_WORDS
export type WordEditWordsInput = (ResourceId & WordPure)[]
export type WordEditWordsPayload = (ResourceId & WordPure)[]


// word:POST_WORDS
export type WordPostWordsInput = WordPureBasic[]
export type WordPostWordsPayload = (ResourceId & WordPure)[]

// word:GET_WORD (Sep 9, 2021)
export type WordGetWordInput = { sem: number, legacyMongoId: string }
export type WordGetWordPayload = (ResourceId & WordPure)[]


// word:DETECT_LANGUAGE
export type wordDetectLanguagePayload = { language: string, isReliable: boolean, confidence: number }[];


// ===============
// User service
// ===============

// user:GOOGLE_SIGN_IN
export type UserGoogleSignInInput = {
  googleUniqueId: string
  familyName: string
}
export type UserGoogleSignInPaylod = undefined

// user:CREATE_USER 
export type UserCreateUserInput = {
  federalProvider: FederalProvider;
  validatingToken: string;
};
export type UserCreateUserPayload = UserPure;


// ===============
// OKR service
// ===============

// okr:DELETE_OKR_OBJECT (Aug 15, 2021)
export type OkrDeleteOkrObjectInput = {
  deletingTargetWrn: Wrn
};
export type OkrDeleteOkrObjectPayload = undefined;

// okr:CHANGE_ORDER_OR_ITEM
export type OkrChangeOrderOfItemInput = { newlyOrderedObjects: (ResourceId & OkrObjectPure)[] };
export type OkrChangeOrderOfItemPayload = undefined;

// okr:GET_OKR_CONTAINER
export type OkrGetOkrContainerInput = { containerWrn: Wrn } ;
export type OkrGetOkrContainerPayload = {
  foundContainerData: OkrContainerPure & ResourceId;
  doesBelongToRequester: boolean;
};

// okr:GET_OKR_OBJECT
export type OkrGetOkrObjectInput = OkrGetMyOkrInput & {
  containingObject: Wrn[] };
export type OkrGetOkrObjectPayload = (ResourceId & OkrObjectPure)[];

// okr:CREATE_OKR_OBJECT_INPUT (Aug 12, 2021)
export type CreateOkrObjectInput = OkrObjectHeader & { associateContainerWrn: Wrn };
export type CreateOkrObjectPayload = OkrContainerPure; // you may wonder, it is because container is updated and frontend should know too.

// OKR:GET_MY_OKR
export type OkrGetMyOkrInput = {
  userLink: string;
  tempAccessToken: string; };
export type OkrGetMyOkrPayload = ResourceId & MyOkrPure & OkrGetMyOkrInput & { isSignedInCheckedByBackend: boolean };



// ===============
// WP service (Wordy Policy Service)
// ===============

// okr:GET_OKR_OBJECT
export type WpChangeWpInput = {
  modifyingTarget: Wrn;
  modifyingWpWrn: AvailableWpWrn;
};
export type WpChangeWpPayload = undefined;