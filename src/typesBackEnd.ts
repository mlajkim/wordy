// These are hardly V4

export type TokenType = 'V4_REFRESH_TOKEN_SECRET' | 'V4_ACCESS_TOKEN_SECRET';

export type User = {
  _id: string;
  federalProvider: FederalProvider;
  federalID: string;
  lastName: string;
  firstName: string;
  email: string;
  creditLimit: number;
};

export type Support = {
  _id: string;
  ownerID: string;
  newWordCnt: number;
  deletedWordCnt: 7;
  sems: number[];
};

export type FederalProvider = 'google';