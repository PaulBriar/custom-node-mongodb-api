const mongoose = require('mongoose');

let feedSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
  },
  body: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Body",
    }
  },
  author: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Author",
    }
  }
});

module.exports = mongoose.model("Feed", feedSchema);