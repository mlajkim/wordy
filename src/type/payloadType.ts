export type Payload = [...WordPayload[]]

export type WordPayload = {
  wrn: string;
  kms: string;
  ownerWrn: string;
  language: Language;
  word: string;
  pronun: string;
  meaning: string;
  example: string;
  tags: string[];
};

export type UserPayload = {
  wrn: string; // this is extremely private
  accountId: string; // this is public 
  nickname: string;
  federalProvider: FederalProvider;
  federalId: string;
}

export type FederalProvider = 'google';
export type Language = 'ko' | 'en' | 'ja' | 'zh';