const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  isSandbox: Boolean,
  userId: String,
  accessToken: String,
  subscriptionID: String,
});

module.exports = mongoose.model('transactions', transactionSchema);