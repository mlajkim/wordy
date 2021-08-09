import mongoose from 'mongoose';
const Schema = mongoose.Schema;
// Types
import { Resource } from '../type/resourceType';

const ENCRYPTED = 'encrypted_'

const encryptedResource: Record<keyof Resource, any> =   {
  resourceVersion: String,
  wrn: String,
  ownerWrn: String, // resource owner.
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
export const OkrModel = mongoose.model(`${ENCRYPTED}okr`, encryptedResourceSchema);