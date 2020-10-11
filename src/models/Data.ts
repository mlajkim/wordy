import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const dataSchema = new Schema({
  ownerID: String,
  sems: Array,
  newWordCnt: Number,
  deletedWordCnt: Number
});

export default mongoose.model('data', dataSchema); 