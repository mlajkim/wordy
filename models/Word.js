const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const wordSchema = new Schema({
  dateAdded: Number,
  word: String,
  pronunciation: String,
  definition: String,
  exampleSentence: String
});

module.exports = mongoose.model('words', wordSchema); // the String value is the collection name