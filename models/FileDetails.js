// FileDetails.js

const mongoose = require('mongoose');

const fileDetailsSchema = new mongoose.Schema({
  filename: String,
  data: Array,
});

const FileDetails = mongoose.model('FileDetails', fileDetailsSchema);

module.exports = FileDetails;
