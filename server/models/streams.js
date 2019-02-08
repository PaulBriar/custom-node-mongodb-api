const mongoose = require('mongoose');

let Stream = mongoose.model('Stream', {
  title: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
  },
  desc: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  }
});

module.exports = { Stream };