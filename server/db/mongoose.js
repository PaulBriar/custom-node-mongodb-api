const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://paul:william1@ds211275.mlab.com:11275/streams-api');

module.exports = {mongoose};