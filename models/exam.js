var mongoose = require("../config/mongoose");
var User = require("./user");

var examSchema = mongoose.Schema({
	name: String,
	credits: Number,
	mark: Number,
	honor: Boolean,
	user: { type: mongoose.Schema.Types.ObjectId, ref:"User"}
});


var Exam = mongoose.model("Exam",examSchema);


module.exports = Exam;	