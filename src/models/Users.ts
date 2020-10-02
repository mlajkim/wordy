import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema({
  federalProvider: String,
  federalID: String,
  lastName: String,
  firstName: String,
  email: String,
  imageUrl: String
});

export default mongoose.model('users', userSchema); 