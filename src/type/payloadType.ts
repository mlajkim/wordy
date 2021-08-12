// Commented on Aug 7, 2021
// this is validated type value
// This data is what backend sends

// Type
import { UserResource, MyOkr, OkrObjectHeader, OkrObject } from '../type/resourceType';
import { 
  FederalProvider, OkrObjectType
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
export type UserCreateUserPayload = UserResource;


// ===============
// OKR service
// ===============

// okr:GET_OKR_OBJECT
export type OkrGetOkrObjectInput = {
  sem: number;
  okrObjectType: OkrObjectType;
}
export type OkrGetOkrObjectPayload = OkrObject[];

// okr:CREATE_OKR_OBJECT_INPUT (Aug 12, 2021)
export type CreateOkrObjectInput = OkrObjectHeader;

// OKR:GET_MY_OKR
export type OkrGetMyOkrInput = {
  userLink: string;
  tempAccessToken: string;
};
export type OkrGetMyOkrPayload = MyOkr;




