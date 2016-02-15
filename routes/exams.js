var express = require('express');
var router = express.Router();
var Exam = require('../models/exam');
var User = require('../models/user');


router.use("/:name",function(req,res,next) {
	var examName = req.params.name;

	Exam.findOne({name:examName},function(error,exam) {
		if(error || !exam) {
			res.json({
				message:"No exam found here"
			});
		} else {
			req.exam = exam;
			next();
		}


	});
});


router.get("/",function(req,res,next) {
  res.send(req.user.exams);
})

router.get("/:name",function(req,res,next) {
	res.send(req.exam);
});

router.put("/:name",function(req,res,next) {
	var examId = req.exam._id;

	Exam.findByIdAndUpdate(examId,req.body,function(error) {
		if(error) {
			res.json({
				message:"Exam update failed"
			});
		} else {
			res.json({
				success:true,
				message:"Exam updated",
				values: req.body
			});
		}
	});
});

router.delete("/:name",function(req,res,next) {
	var examId = req.exam._id;

	Exam.remove({_id:examId},function(error) {
		if(error) {
			res.json({
				message:"Exam deletion failed"
			});
		} else {
			User.findByIdAndUpdate(req.exam.user,{$pull:{exams:{_id: examId}}},{safe:true},function(error) {
				if(error) {
					res.json({
						message:"Failed to remove exam from user"
					})
				} else {
					res.json({
						success:true,
						message:"Exam deleted"
					})
				}
			});
		}

	});


});

router.post("/",function(req,res,next) {
  var userId = req.user._id;
  req.body.user = userId;

  var newExam = new Exam(req.body);
  newExam.save(function(error) {
    if(error) {
      res.json({
        message:"Exam insertion failed"
      })
    } else {
     User.findByIdAndUpdate(userId,{$push:{"exams":newExam._id}},{safe:true,upsert:true},function(error) {
     	if(error) {
     		res.json({
     			message:"Failed to associate exam to user."
     		})
     	} else {
     		res.json({
     			success:true,
     			message:"Exam inserted",
     			values: newExam
     		})
     	}
     });
    }
  });
});



module.exports = router;
