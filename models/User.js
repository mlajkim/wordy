const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  emailAddress: String,
    f: String,
  firstName: String,
  lastName: String,
  userType: String
});

module.exports = mongoose.model('users', userSchema); 