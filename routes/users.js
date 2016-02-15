var express = require('express');
var router = express.Router();
var User = require("../models/user")

router.use('/:username',function(req,res,next) {

	var username = req.params.username;
	if(username != req.authenticated.username) {
		res.json({
			success:false,
			message:"You are not allowed to see this page"
		})
	} else {
		User.findOne({username:username}).populate("exams").exec(function(error,user) {
			if(error || !user) {
				res.json({
					message:"No user found"
				});
			} else {
				req.user = user;
				next();
			}
		});
	}
});




router.get("/:username",function(req,res,next) {
	res.send(req.user);
});

router.put("/:username",function(req,res,next) {
	User.findById(req.user._id,function(error,user) {
		if(error) {
			res.json({
				message:"Failed to update user"
			});
		} else {
			user.username = req.body.username;
			user.password = req.body.password;
			user.save(function(error) {
				if(error) {
					res.json({
						message:"Failed to update user"
					});
				} else {
					res.json({
						success:true,
						message:"User updated",
						values:req.body
					})
				}
			});
		}
	});
});

router.delete("/:username",function(req,res,next) {
	User.remove({_id:req.user._id},function(error) {
		if(error) {
			res.json({
				message:"Failed to delete user"
			})
		} else {
			res.json({
				"message":"User deleted"
			})
		}
	});
});





module.exports = router;
