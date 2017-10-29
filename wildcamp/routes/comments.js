var express 	= require("express"),
	router		= express.Router({mergeParams: true}),
	Camping 	= require("../models/camping"),
	Comment 	= require("../models/comment");


router.get("/new", function(req, res){
	Camping.findById(req.params.id, function(err, foundCamp){
		if(err){
			res.redirect("/campings")
		} else{
			res.render("comments/new", {camping: foundCamp});
		}
	});
	
});

router.post("/", isLoggedIn, function(req, res){
	Camping.findById(req.params.id, function(err, foundCamp){
		if(err){
			console.log(err);
			res.redirect("/campings");
		} else{
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log(err);
					res.redirect("/campings");
				} else{
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					foundCamp.comments.push(comment);
					foundCamp.save();
					res.redirect("/campings/" + foundCamp._id);
				}
			}
		)};
	});
});

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
};

module.exports = router;