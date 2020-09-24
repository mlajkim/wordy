const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  isSandbox: Boolean,
  userId: String,
  subscriptionID: String,
  isActive: Boolean,
  nextBillingDate: String,
  tokenExpireAt: Number,
  accessToken: String,
});

module.exports = mongoose.model('transactions', transactionSchema);