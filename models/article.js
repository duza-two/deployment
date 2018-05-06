var mongoose = require('mongoose');

// schema for uploading articles
var BlogSchema = mongoose.Schema({
  fieldname:  String,
  originalname: String,
  encoding: String,
  mimetype: String,
  destination: String,
  filename: String,
  path: String,
  size: String,
  title: String,
  author: String,
  body: String
});

var Blog = module.exports = mongoose.model('Blog', BlogSchema);
