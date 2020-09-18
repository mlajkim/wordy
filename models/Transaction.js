const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  userId: String,
  data: Object,
  details: Object
});

module.exports = mongoose.model('transactions', transactionSchema);