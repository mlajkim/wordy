// More like resource type right?


export type Resource = {
  wrn: string // Plaintext
  ownerWrn: string // Plaintext
  keyWrn: string // Plaintext
  encryptedDek: string // Encrypted data encrpytion key.
  ciphertextBlob: WordResource | UserResource | KeyResource // Encrypted Data OR plain text data if cmkWrn is blank
};


/**
 * 
CMK resource
 = {
  wrn: wrn::kms:cmk:awsddb:+a!_sfs9sd2id0fd9asdd9adxx9823_ds0fasd9Fsd!
  ownerWrn: wrn::user::mdb:+d9asdd9adxx9823_ds9sd2id0fs0fasd9Fsd!
  cmkWrn: "wrn::kms:masterkey:awsddb:+a!_sfs9sd2id0fd9asdd9adxx9823_ds0fasd9Fsd!" // blank (wordy managed key)
  CiphertextBlob: 78a8sdyahdahdygaudshroq3rhehfshbfnsoidsuiydbsuydsahdjaiudoq3rhehfshbfnsshroq3rhehfshbfnsoidsuiydbsuydsahdjaiudhdjshroq3rhehfshbfnsoidsuiydbsuydsahdjaiudansxjahkbxiadnabkhjdbhasbdiushroq3rhehfshbfnsoidsuiydbsuydsahdjaiud
};

Resource = {
  wrn: wrn::word:mdb:s9sd2id0fs0f+d9asdd9adxx9823_dasd9Fsd!
  ownerWrn: wrn::user:mdb:+d9asdd9adxx9823_ds9sd2id0fs0fasd9Fsd!
  cmkWrn: wrn::cmk:awsddb:+a!_sfs9sd2id0fd9asdd9adxx9823_ds0fasd9Fsd!
  CiphertextBlob: 78a8sdyahdahdygaudshroq3rhehfshbfnsoidsuiydbsuydsahdjaiudoq3rhehfshbfnsshroq3rhehfshbfnsoidsuiydbsuydsahdjaiudhdjshroq3rhehfshbfnsoidsuiydbsuydsahdjaiudansxjahkbxiadnabkhjdbhasbdiushroq3rhehfshbfnsoidsuiydbsuydsahdjaiud
};

 */

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