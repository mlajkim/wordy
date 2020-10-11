import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const prefSchema = new Schema({
  ownerID: String,
  langPage: String, // lang pref of the web app
  langAdd: String, // lang pref of adding word
  langOrder: Array,  // language order preference
  semOrder: String, // can be boolean, how you want to manage the sem order in list
});

export default mongoose.model('pref', prefSchema); 