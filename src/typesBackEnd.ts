import { EventType } from "./type/wordyEventType";


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
  principal: Principal[] | Principal | [];
  action: "*" | EventType[] | EventType;
  condition?: Condition;
};

// Condition
export type Condition = {
  requesterWrnMatchesResourceOwnerWrn?: boolean; // checks if the resource requester is trying to get is the same as owner.
}

export type Principal = Wrn;
export type Wrn = string;

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

