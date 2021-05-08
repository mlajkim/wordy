import mongoose from 'mongoose';
const Schema = mongoose.Schema;
// Types
import { Resource } from '../type/resourceType';

const encryptedKeyRecord: Record<keyof Resource, any> = {
  wrn: String,
  ownerWrn: String,
  keyWrn: String,
  encryptedDek: String,
  ciphertextBlob: Object
}

// Finally export as a schema
const encryptedKeySchema = new Schema(encryptedKeyRecord);
export default mongoose.model('encryptedKey', encryptedKeySchema); 