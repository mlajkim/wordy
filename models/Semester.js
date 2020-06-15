const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const semesterSchema = new Schema({
  owner: String,
  year: Number,
  semester: Number
});

module.exports = mongoose.model('semesters', semesterSchema);