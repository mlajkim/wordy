import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const wordSchema = new Schema({
  //Data wise (Personal as well) (I can calculated, how many times reviewd for each semester, does it have to be reviwed now? etc..)
  ownerID: String, // who owns this?
  order: Number, // the order number
  dateAdded: String, // 204 = 2020 year of 4th semester
  lastReviewed: String,
  review: Array, // contains like following .. [24, 15, 30, 24] => the last 24 will be the last Review Date's semester
  // Community Data
  seederID: String, // who originally created this? (If owner and seeder does not match, you can edit it, but you cant sell it.)
  packageID: String, // what kind of pacakge? (package has its own owner, selling price.. sold amounts etvc...)
  // Personal data 
  sem: Number,
  language: String,
  tag: Array,
  word: String,
  pronun: String,
  meaning: String,
  example: String,
  isPublic: Boolean,
  
});

export default mongoose.model('words', wordSchema); 