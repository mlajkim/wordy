import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const supportSchema = new Schema({
  ownerID: String,
  sems: Array,
  newWordCnt: Number,
  deletedWordCnt: Number,
  wordOrderPref: String,
  yearOrderPref: String,
});

export default mongoose.model('supports', supportSchema); 