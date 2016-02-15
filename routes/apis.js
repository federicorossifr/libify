var express = require('express');
var router = express.Router();
var jwt = require("jsonwebtoken");
var secret = require("../config/secret");
var User = require("../models/user");


router.post('/auth', function(req, res, next) {
	User.findOne ({username:req.body.username},function(error,user) {
		if(error) {
			res.json({
				message:"Error during authentication"
			})
		} else {
			if(!user) {
				res.json({
					success:false,
					message:"User not found"
				})
			} else {
				user.authenticate(req.body.password,function(error,matched) {
					if(error) throw error;
					if(matched) {
						var token = jwt.sign(user,secret);
						res.json({
							success:true,
							message:"Authenticated",
							token:token
						});
					} else {
						res.json({
							success:false,
							message:"Invalid password"
						})
					}
				})
			}
		}
	});
});

router.post('/users/', function(req, res, next) {
  var newUser = new User(req.body);
  newUser.save(function(error) {
  	if(error)
  		res.json({
  			success:false,
  			code:error.code
  		})
  	else
  		res.json({
  			success:true,
  			message:"User created",
  			values: newUser
  		});
  });
});


router.use("/",function(req,res,next) {
	var token = req.body.token || req.query.token || req.headers["x-access-token"];

	if(token) {
		jwt.verify(token,secret,function(error,decoded) {
			if(error) {
				return res.json({
					success:false,
					message:"Failed to validate token"
				});
			} else {
				req.authenticated = decoded._doc;
				console.log(decoded);
				next();
			}
		});
	} else {
		res.json({
			success:false,
			message:"No token provided"
		})
	}
});

module.exports = router;
