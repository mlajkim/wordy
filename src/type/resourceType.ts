// More like resource type right?


export type Resource = {
  wrn: string // Plaintext
  ownerWrn: string // Plaintext
  keyWrn: string // Plaintext
  encryptedDek: string // Encrypted data encrpytion key.
  ciphertextBlob: any // Encrypted Data OR plain text data if cmkWrn is blank
};

export type IdentifierResource = {
  validRefreshtokens: Refreshtoken[]
};

export type Refreshtoken = {
  macAddress: string;
  region: string; // Japan or Korea, United States
  refrehstoken: string;
}

export type WordResource = {
  language: 'ko' | 'en' | 'ja' | 'zh'
  word: string
  pronun: string
  meaning: string
  example: string
  tags: string[]
};

export type KeyResource = {
  isEnabled: boolean // if disabled, you cannot use this key
  encryptionType: string
  keyValue: string // hash
}

export type UserResource = {
  // Identifier for Login
  federalProvider: 'google'
  federalId: string
  validRefreshToken: string[]
  // MFA
  secondPassword: number
  mfa: any
  // General Infromation 
  firstName: string
  lastName: string
  nickname: string
  profileImageUrl: string
  email: string
};