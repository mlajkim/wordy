import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const yearSchema = new Schema({
  ownerID: String,
  year: Number,
  sem: Number
});

export default mongoose.model('years', yearSchema); 