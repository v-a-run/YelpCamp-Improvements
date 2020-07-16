var Campground = require("../models/campground"),
	Comment	   = require("../models/comment");


var middlewareObj = {}

middlewareObj.checkCampgroundOwnership = function(req, res, next){
			// is user logged in ?
		if(req.isAuthenticated()){
			Campground.findById(req.params.id, function(err, foundCampground){
				if(err){
					req.flash("error", err.message);
					res.redirect("back");
					} else{
						// is user the owner of campground
						if(foundCampground.author.id.equals(req.user._id)){
							next();
							} else{
						// else redirect 
							req.flash("error", "Permission denied.");
							res.redirect("back");
							}
					}
			});
		} else{
			// else redirect
			req.flash("error", "Please Login first.");
			res.redirect("back");
		}
	}

middlewareObj.checkCommentOwnership = function(req, res, next){
			// is user logged in ?
		if(req.isAuthenticated()){
			Comment.findById(req.params.comment_id, function(err, foundComment){
				if(err){
					req.flash("error", err.message);
					res.redirect("back");
					} else{
						// is user the owner of campground ?
						if(foundComment.author.id.equals(req.user._id)){
							next();
							} else{
						// else redirect 
							req.flash("error", "Permission denied.");
							res.redirect("back");
							}
					}
			});
		} else{
			// else redirect
			req.flash("error", "Please Login first.");
			res.redirect("back");
		}
	}

middlewareObj.isLoggedIn = function(req, res, next){
		if(req.isAuthenticated()){
			return next();
		} else{
			req.flash("error", "Please Login first.")
			res.redirect("/login");
		}
	}

module.exports = middlewareObj;