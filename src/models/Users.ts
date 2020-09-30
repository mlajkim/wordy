import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema({
  id: String,
  federalProvider: String,
  federalID: String,
  lastName: String,
  firstName: String,
  email: String
});

export default mongoose.model('users', userSchema); 