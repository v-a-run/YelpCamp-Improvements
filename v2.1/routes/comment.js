const express = require("express");
const router = express.Router({ mergeParams: true });
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const middleware = require("../middleware");

//############# COMMENTS ROUTES ##############//

// NEW Route : Shows form to create a new comment
router.get("/new", middleware.isLoggedIn, async (req, res) => {
  try {
    const campground = await Campground.findById(req.params.id);
    res.render("comments/new", { campground });
  } catch (err) {
    console.log(err);
    req.flash("error", "Campground not found");
    res.redirect("back");
  }
});

// CREATE Route : Adds a new comment to campground
router.post("/", middleware.isLoggedIn, async (req, res) => {
  try {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
      req.flash("error", "Campground not found");
      return res.redirect("/campgrounds");
    }

    const comment = await Comment.create(req.body.comment);

    // add author info
    comment.author.id = req.user._id;
    comment.author.username = req.user.username;
    await comment.save();

    campground.comments.push(comment);
    await campground.save();

    req.flash("success", "Comment Added Successfully.");
    res.redirect("/campgrounds/" + campground._id);
  } catch (err) {
    console.log(err);
    req.flash("error", err.message);
    res.redirect("/campgrounds");
  }
});

// EDIT Route : Shows edit form for comment
router.get(
  "/:comment_id/edit",
  middleware.checkCommentOwnership,
  async (req, res) => {
    try {
      const foundComment = await Comment.findById(req.params.comment_id);
      res.render("comments/edit", {
        comment: foundComment,
        campground_id: req.params.id,
      });
    } catch (err) {
      req.flash("error", err.message);
      res.redirect("back");
    }
  }
);

// UPDATE Route : Updates the comment
router.put(
  "/:comment_id",
  middleware.checkCommentOwnership,
  async (req, res) => {
    try {
      await Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment);
      req.flash("success", "Comment Updated");
      res.redirect("/campgrounds/" + req.params.id);
    } catch (err) {
      req.flash("error", err.message);
      res.redirect("back");
    }
  }
);

// DELETE Route : Deletes the comment
router.delete(
  "/:comment_id",
  middleware.checkCommentOwnership,
  async (req, res) => {
    try {
      await Comment.findByIdAndDelete(req.params.comment_id);
      req.flash("success", "Comment Deleted");
      res.redirect("/campgrounds/" + req.params.id);
    } catch (err) {
      req.flash("error", err.message);
      res.redirect("back");
    }
  }
);

module.exports = router;
