const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  typeOfLogIn: String,
  federalId: String, // Google's googleId;
  email: String,
  familyName: String,
  givenName: String,
  profileImgUrl: String,
  subscription: String,
  joinedDate: String,
  lastUsed: String
});

module.exports = mongoose.model('users', userSchema); 