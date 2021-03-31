import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema({
  dateAdded: Number,
  federalProvider: String,
  federalID: String,
  lastName: String,
  firstName: String,
  email: String,
  imageUrl: String,
  languagePreference: String,
  creditLimit: Number,
  validRefreshToken: String
});

export default mongoose.model('users', userSchema); 