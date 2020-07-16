var express = require('express'),
	router  = express.Router(),
	passport = require('passport'),
	User = require("../models/user")

	// MAIN Route
	router.get("/", function(req, res){
		res.render("landing");
	});

//########### AUTH ROUTES ##############//

	// Show SIGN UP form
	router.get("/register", function(req, res){
		// req.flash("error", err.message);
		res.render("register");
	});

	// SIGN UP logic
	// router.post("/register", function(req, res){
	// 	var newUser = new User({username : req.body.username});
	// 	User.register(newUser, req.body.password, function(err, user){
	// 		if(err){
	// 			req.flash("error", err.message);
	// 			//console.log(err);
	// 			return res.render("register");
	// 		} else{
	// 			passport.authenticate("local")(req, res, function(err, user){
	// 				req.flash("success", "Signed Up Successfully, Welcome " + user.username);
	// 				res.redirect("/campgrounds");
	// 			});
	// 		}
	// 	});
	// });
	router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
           req.flash("success", "Successfully Signed Up! Nice to meet you " + req.body.username);
           res.redirect("/campgrounds"); 
        });
    });
});

	// Show LOG IN form
	router.get("/login", function(req, res){
		res.render("login");
	});

	// LOG IN logic
	router.post("/login", function(req, res, next){
		passport.authenticate("local", 
	{
		successRedirect : "/campgrounds",
		failureRedirect : "/login",
		failureFlash 	: true,
		successFlash	: "Welcome Back, " + req.body.username + " !!"
	})(req, res);
	});

	// LOGOUT logic  //
	router.get("/logout", function(req, res){
		req.logout();
		req.flash("success", "You are Logged Out. See ya later !")
		res.redirect("/campgrounds");
	});

	// Show ABOUT route //
	router.get("/about", function(req,res){
		res.render("about");
	})

module.exports = router;