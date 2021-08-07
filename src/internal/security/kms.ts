// Main
import dotenv from 'dotenv';
// external library
import Cryptr from 'cryptr';
import cryptoRandomString from 'crypto-random-string';
// type
// import { Resource } from '../../type/resourceType';
// import { AvailableCmkWrn, EncrpytionMethod } from '../../type/availableType';

// kms decides which cmkWrn uses. not others.
export const kmsService = (type: "Encrpyt" | "Decrypt", encryptedDek?: string) => {
  if (type === "Encrpyt") return kmsInternalEncrypter();
  else return kmsInternalDecrypter(encryptedDek ? encryptedDek : "");
};

const kmsInternalDecrypter = (encryptedDek: string) => {
  // be able to run the env key
  dotenv.config();
  
  // generate encrypted data encrpytion key (by deafult it will be all)
  const { decrypt } = new Cryptr(process.env.WRN__KMS_MASTER_ENV_1_210804!);
  const plainkey = decrypt(encryptedDek);

  return {
    encryptionMethod: "NotEncrypted",
    cmkWrn: "wrn::kms:master:env:1:210804",
    encryptedDek: encryptedDek,
    plainkey // the end user will use this to encrypt
  };
}

const kmsInternalEncrypter = () => {
  // be able to run the env key
  dotenv.config();

  // generate unecrpyted data encryption key
  const plainkey = cryptoRandomString({length: 44, type: 'base64'});
  
  // generate encrypted data encrpytion key (by deafult it will be all)
  const { encrypt } = new Cryptr(process.env.WRN__KMS_MASTER_ENV_1_210804!);
  const newEncryptedDek = encrypt(plainkey);

  return {
    encryptionMethod: "AES-256-GCM",
    cmkWrn: "wrn::kms:master:env:1:210804",
    encryptedDek: newEncryptedDek,
    plainkey // the end user will use this to encrypt
  };
}