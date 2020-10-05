import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const wordSchema = new Schema({
  ownerID: String,
  dateAdded: String,
  year: Number,
  semester: Number,
  language: String,
  tag: String,
  word: String,
  pronun: String,
  define: String,
  example: String,
  isPublic: Boolean
});

export default mongoose.model('words', wordSchema); 