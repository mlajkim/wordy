import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const languageSchema = new Schema({
  ownerID: String,
  firstName: String,
  addedWordsCount: Number,
  deletedWordsCount: Number,
  addWordLangPref: String,
  data: Array
});

export default mongoose.model('languages', languageSchema); 