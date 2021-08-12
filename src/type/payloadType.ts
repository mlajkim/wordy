// Commented on Aug 7, 2021
// this is validated type value
// This data is what backend sends

// Type
import { UserResource, MyOkr } from '../type/resourceType';
import { FederalProvider } from './availableType';


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

// okr:getMyOkr
export type OkrGetMyOkrInput = {
  userLink: string;
  tempAccessToken: string;
};
export type OkrGetMyOkrPayload = MyOkr;