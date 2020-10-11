import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const dataSchema = new Schema({
  ownerID: String,
  newWordCnt: Number,
  deletedWordCnt: Number
});

export default mongoose.model('data', dataSchema); 