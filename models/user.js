var mongoose = require("../config/mongoose");
var bcrypt = require('bcryptjs'),
    SALT_WORK_FACTOR = 10;

var userSchema = mongoose.Schema({
	username: {type:String, index:{unique:true}},
	password: String,
	exams: [{ type: mongoose.Schema.Types.ObjectId, ref:"Exam"}]
});

userSchema.methods.authenticate = function(providedPassword,callback) {
	bcrypt.compare(providedPassword,this.password,function(error,isMatch) {
		if(error) return callback(error);
		else callback(null,isMatch);
	});
}

userSchema.pre('save',function(next) {
	var user = this;
	if(!user.isModified('password')) return next();
	bcrypt.genSalt(SALT_WORK_FACTOR,function(error,salt) {
		if(error) return next(error);
		bcrypt.hash(user.password,salt,function(error,hash) {
			if(error) return next(error);
			user.password = hash;
			next();
		});
	});
});


var User = mongoose.model("User",userSchema);

module.exports = User;


