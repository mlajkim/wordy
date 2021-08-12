import mongoose from 'mongoose';
const Schema = mongoose.Schema;
// Types
import { Resource } from '../type/resourceType';

const ENCRYPTED = 'encrypted_'

const encryptedResource: Record<keyof Resource, any> =   {
  resourceVersion: String,
  wrn: String,
  dateAdded: Number,
  ownerWrn: String, // resource owner.
  createdByWrn: String, // the one who created this resource
  // wordy policy checker 
  wpWrn: String, //
  // Encrpytion
  encryptionMethod: String,
  isClientEncrpyted: Boolean, // client key encrypts the encryptedDek after 
  cmkWrn: String, // cmk data does not change.
  encryptedDek: String,
  // Actual data
  ciphertextBlob: String,
  notEncrpytedData: Object
};

// Finally export as a schema
const encryptedResourceSchema = new Schema(encryptedResource);

// Path importing
export const UserModel = mongoose.model(`${ENCRYPTED}user`, encryptedResourceSchema);
export const LogModel = mongoose.model(`${ENCRYPTED}log`, encryptedResourceSchema);
// Okr
export const MyOkrModel = mongoose.model(`${ENCRYPTED}my_okr`, encryptedResourceSchema);