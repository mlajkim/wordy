const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  emailAddress: String,
  password: String,
  firstName: String,
  lastName: String,
  userType: String
});

module.exports = mongoose.model('users', userSchema); 