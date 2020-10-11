import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const packageSchema = new Schema({
  //Data wise (Personal as well) (I can calculated, how many times reviewd for each semester, does it have to be reviwed now? etc..)
  ownerID: String, // who owns this? (Who wrote this?)
  dateAdded: String, // when has it been made?
  dataID: Array, // list of words (Even if the owner deletes the words, you still can have the data.)
  
});

export default mongoose.model('packages', packageSchema); 