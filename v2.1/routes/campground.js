var express = require('express'),
	router  = express.Router(),
	Campground = require("../models/campground"),
	// automatically uses index.js in any folder so don't need to mention it //
	middleware = require("../middleware");

	// INDEX Route : Shows all campgrounds
	router.get("/", function(req, res){
		// Get all campgrounds from DB //
		Campground.find({}, function(err, allCampgrounds){
			if(err){
				req.flash("error", err.message);
				console.log(err);
			} else{
				res.render("campgrounds/index", {campgrounds : allCampgrounds});
			}
		});
	});

	// CREATE Route : Adds a new campground to DB
	router.post("/", middleware.isLoggedIn, function(req, res){
		var name 		  = req.body.name,
			price		  = req.body.price,
			image 		  = req.body.image,
			desc 		  = req.body.description,
			author		  = {
				id : req.user._id,
				username : req.user.username
			},
			newCampground = {name : name, price : price, image : image, description : desc, author : author};
		
		// Add new campground in DB //
		Campground.create(newCampground, function(err, newlyCreated){
			if(err){
				req.flash("error", err.message);
				console.log(err);
			} else{
				req.flash("success", "Campground Added Successfully.");
				// redirect back to /campgrounds //
				res.redirect("/campgrounds")
			}
		});
	});

	// NEW Route : Shows a form to create a new campground
	router.get("/new", middleware.isLoggedIn, function(req, res){
		res.render("campgrounds/new")
	});

	// SHOW Route : Shows info about a campground
	router.get("/:id", function(req, res){
		// Find campground provided by ID //
		Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
			if(err){
				req.flash("error", err.message);
				console.log(err);
			} else{
				//console.log(foundCampground)
				// Render Show file // 
				res.render("campgrounds/show", {campground : foundCampground});
			}
		})
	});

	// EDIT Route : Show Edit Campground form 
	router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
		Campground.findById(req.params.id, function(err, foundCampground){
			if(err){
				req.flash("error", "Something Went Wrong.");
				res.redirect("/campgrounds");
			} else {
				res.render("campgrounds/edit", {campground : foundCampground });
			}
		});
	});

	// UPDATE Route : Update campground and redirect somewhere
	router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
		Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
			if(err){
				req.flash("error", "Something Went Wrong. Couldn't Update.");
				res.redirect("/campgrounds")
			} else{
				req.flash("success", "Campground Updated.");
				res.redirect("/campgrounds/" + req.params.id);
			}
		});
	});

	// DELETE Route : Deletes campground
	// router.delete("/:id", function(req, res){
	// 	Campground.findByIdAndRemove(req.params.id, function(err, foundCampground){
	// 		err ? console.log(err) : res.redirect("/campgrounds");
	// 	});
	// });
		router.delete("/:id", middleware.checkCampgroundOwnership, async(req,res)=>{
			try {
			let foundCampground = await Campground.findById(req.params.id);
			await foundCampground.remove();
				req.flash("success", "Campground Deleted.");
				res.redirect("/campgrounds");
			} catch (error) {
				req.flash("error", "Something Went Wrong.");
				res.redirect("/campgrounds");
			}
		});

module.exports = router;