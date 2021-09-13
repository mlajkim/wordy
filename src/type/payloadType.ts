// Commented on Aug 7, 2021
// this is validated type value
// This data is what backend sends

// Type
import { UserPure, MyOkrPure, OkrObjectHeader, OkrObjectPure, ResourceId,
  OkrContainerPure, WordPure
} from '../type/resourceType';
import { 
  AvailableWpWrn,
  FederalProvider, Wrn
} from './availableType';

// ===============
// User service
// ===============

// word:GET_WORD (Sep 9, 2021)
export type WordGetWordInput = { sem: number, legacyMongoId: string };
export type WordGetWordPayload = (ResourceId & WordPure)[];


// word:DETECT_LANGUAGE
export type wordDetectLanguagePayload = { language: string, isReliable: boolean, confidence: number }[];


// ===============
// User service
// ===============

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