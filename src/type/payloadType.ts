// Commented on Aug 7, 2021
// this is validated type value
// This data is what backend sends

// Type
import { UserPure, MyOkrPure, OkrObjectHeader, OkrObjectPure, ResourceId } from '../type/resourceType';
import { 
  AvailableWpWrn,
  FederalProvider, OkrObjectType, Wrn
} from './availableType';

// ===============
// User service
// ===============

// word:detectLanguge
export type wordDetectLanguagePayload = { language: string, isReliable: boolean, confidence: number }[];

// user:createUser 
export type UserCreateUserInput = {
  federalProvider: FederalProvider;
  validatingToken: string;
};
export type UserCreateUserPayload = UserPure;


// ===============
// OKR service
// ===============

// okr:GET_OKR_OBJECT
export type OkrGetOkrObjectInput = OkrGetMyOkrInput & {
  sem: number;
  okrObjectType: OkrObjectType;
}
export type OkrGetOkrObjectPayload = (ResourceId & OkrObjectPure)[];

// okr:CREATE_OKR_OBJECT_INPUT (Aug 12, 2021)
export type CreateOkrObjectInput = OkrObjectHeader;

// OKR:GET_MY_OKR
export type OkrGetMyOkrInput = {
  userLink: string;
  tempAccessToken: string;
};
export type OkrGetMyOkrPayload = ResourceId & MyOkrPure & OkrGetMyOkrInput;



// ===============
// WP service (Wordy Policy Service)
// ===============

// okr:GET_OKR_OBJECT
export type WpChangeWpInput = {
  modifyingTarget: Wrn;
  modifyingWpWrn: AvailableWpWrn;
};
export type WpChangeWpPayload = undefined;
