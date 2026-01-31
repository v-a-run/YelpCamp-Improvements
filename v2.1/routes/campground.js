const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const middleware = require("../middleware");

// INDEX Route : Shows all campgrounds
router.get("/", async (req, res) => {
  try {
    const allCampgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds: allCampgrounds });
  } catch (err) {
    req.flash("error", err.message);
    console.log(err);
    res.redirect("back");
  }
});

// CREATE Route : Adds a new campground to DB
router.post("/", middleware.isLoggedIn, async (req, res) => {
  try {
    const newCampground = {
      name: req.body.name,
      price: req.body.price,
      image: req.body.image,
      description: req.body.description,
      author: {
        id: req.user._id,
        username: req.user.username,
      },
    };

    await Campground.create(newCampground);
    req.flash("success", "Campground Added Successfully.");
    res.redirect("/campgrounds");
  } catch (err) {
    req.flash("error", err.message);
    console.log(err);
    res.redirect("back");
  }
});

// NEW Route : Shows a form to create a new campground
router.get("/new", middleware.isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});
// SHOW Route : Shows info about a campground
router.get("/:id", async (req, res) => {
  try {
    const foundCampground = await Campground.findById(req.params.id).populate(
      "comments"
    );

    if (!foundCampground) {
      req.flash("error", "Campground not found");
      return res.redirect("/campgrounds");
    }

    res.render("campgrounds/show", { campground: foundCampground });
  } catch (err) {
    req.flash("error", err.message);
    console.log(err);
    res.redirect("/campgrounds");
  }
});

// EDIT Route : Show Edit Campground form
router.get(
  "/:id/edit",
  middleware.checkCampgroundOwnership,
  async (req, res) => {
    try {
      const foundCampground = await Campground.findById(req.params.id);
      res.render("campgrounds/edit", { campground: foundCampground });
    } catch (err) {
      req.flash("error", "Something went wrong.");
      res.redirect("/campgrounds");
    }
  }
);

// UPDATE Route : Update campground
router.put("/:id", middleware.checkCampgroundOwnership, async (req, res) => {
  try {
    await Campground.findByIdAndUpdate(req.params.id, req.body.campground);
    req.flash("success", "Campground Updated.");
    res.redirect("/campgrounds/" + req.params.id);
  } catch (err) {
    req.flash("error", "Couldn't update campground.");
    res.redirect("/campgrounds");
  }
});

// DELETE Route : Deletes campground
router.delete("/:id", middleware.checkCampgroundOwnership, async (req, res) => {
  try {
    const foundCampground = await Campground.findById(req.params.id);
    await foundCampground.deleteOne();
    req.flash("success", "Campground Deleted.");
    res.redirect("/campgrounds");
  } catch (err) {
    req.flash("error", "Something went wrong.");
    res.redirect("/campgrounds");
  }
});

module.exports = router;
