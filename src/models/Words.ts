import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const wordSchema = new Schema({
  ownerID: String,
  dateAdded: String,
  year: Number,
  sem: Number,
  language: String,
  tag: Array,
  word: String,
  pronun: String,
  meaning: String,
  example: String,
  isPublic: Boolean
});

export default mongoose.model('words', wordSchema); 