import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const languageSchema = new Schema({
  ownerID: String,
  firstName: String,
  addWordLangPref: String,
  data: Array
});

export default mongoose.model('languages', languageSchema); 