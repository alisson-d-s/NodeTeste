const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/testdb');
mongoose.Promise = global.Promise;

module.exports = mongoose;