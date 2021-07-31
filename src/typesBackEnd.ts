import { EventType } from "./type/wordyEventType";


export type Gateway = "iamGateway" | "wcsGateway" | "kmsGateway" | "mongoGateway" | "cloudTrailGateway";

// Policy
export const AUTHORIZED_MESSAGE = "Authorized";

// Policy
export type Policy = {
  version: "1.0.210729";
  comment?: string;
  statement: StatementType[] | StatementType | [];
};

// Policy Statement
export type StatementType = {
  effect: "Allow" | "Deny";
  principal: string[] | string | [];
  action: "*" | EventType[] | EventType;
}

export type TokenType = 'V4_REFRESH_TOKEN_SECRET' | 'V4_ACCESS_TOKEN_SECRET';

export type User = {
  _id: string;
  federalProvider: FederalProvider;
  federalID: string;
  lastName: string;
  firstName: string;
  email: string;
  creditLimit: number;
  validRefreshToken: string;
};

export type Support = {
  _id: string;
  ownerID: string;
  newWordCnt: number;
  deletedWordCnt: 7;
  sems: number[];
};

export type FederalProvider = 'google';


export type Event = {
  eventVersion: string;
  eventId: string;
  sourceIp: string;
  destinationIp: string;
  ohWow: string;
}

