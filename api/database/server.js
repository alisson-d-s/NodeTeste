const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/apidb');
mongoose.Promise = global.Promise;

module.exports = mongoose;