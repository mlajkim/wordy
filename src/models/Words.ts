import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const wordSchema = new Schema({
  ownerID: String,
  order: Number,
  dateAdded: String,
  sem: Number, // 204 = 2020 year of 4th semester
  language: String,
  tag: Array,
  word: String,
  pronun: String,
  meaning: String,
  example: String,
  isPublic: Boolean
});

export default mongoose.model('words', wordSchema); 