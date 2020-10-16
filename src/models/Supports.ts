import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const supportSchema = new Schema({
  ownerID: String,
  sems: Array,
  newWordCnt: Number,
  deletedWordCnt: Number,
  wordOrderPref: String, // asc or desc
  yearOrderPref: String, // asc or desc
  wordDisplayPref: String, // wordcard or list (or others even)
});

export default mongoose.model('supports', supportSchema); 