import mongoose from 'mongoose';
const Schema = mongoose.Schema;
// Types
import { Resource } from '../type/resourceType';

const encryptedIdentifierRecord: Record<keyof Resource, any> =   {
  wrn: String,
  ownerWrn: "",
  keyWrn: String,
  encryptedDek: String,
  ciphertextBlob: Object
}

// Finally export as a schema
const encryptedIdentifierSchema = new Schema(encryptedIdentifierRecord);
export default mongoose.model('encryptedIdentifier', encryptedIdentifierSchema); 