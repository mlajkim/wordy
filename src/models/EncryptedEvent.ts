import mongoose from 'mongoose';
const Schema = mongoose.Schema;
// Types
import { Resource } from '../type/resourceType';

const encryptedEventRecord: Record<keyof Resource, any> =   {
  wrn: String,
  ownerWrn: "",
  keyWrn: String,
  encryptedDek: String,
  ciphertextBlob: Object
}

// Finally export as a schema
const encryptedEventSchema = new Schema(encryptedEventRecord);
export default mongoose.model('encryptedEvent', encryptedEventSchema); 