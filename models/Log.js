const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const logSchema = new Schema({
  userId: String,
  dateReviewed: Number,
  wordId: String
});

module.exports = mongoose.model('logs', logSchema); // the String value is the collection name