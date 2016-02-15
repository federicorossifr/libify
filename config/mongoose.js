var mongoose = require("mongoose");

var connectionString = ""; //put here your connection string
mongoose.connect(connectionString);

module.exports = mongoose;