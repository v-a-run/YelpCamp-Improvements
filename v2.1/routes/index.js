const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");

// MAIN Route
router.get("/", (req, res) => {
  res.render("landing");
});

//########### AUTH ROUTES ##############//

// Show SIGN UP form
router.get("/register", (req, res) => {
  res.render("register");
});

// SIGN UP logic
router.post("/register", (req, res) => {
  const newUser = new User({ username: req.body.username });

  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      req.flash("error", err.message);
      return res.render("register");
    }

    passport.authenticate("local")(req, res, () => {
      req.flash(
        "success",
        "Successfully Signed Up! Nice to meet you " + user.username
      );
      res.redirect("/campgrounds");
    });
  });
});

// Show LOG IN form
router.get("/login", (req, res) => {
  res.render("login");
});

// LOG IN logic
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
    failureFlash: true,
    successFlash: true,
  })
);

// LOGOUT logic (FIXED)
router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are Logged Out. See ya later!");
    res.redirect("/campgrounds");
  });
});

// ABOUT route
router.get("/about", (req, res) => {
  res.render("about");
});

module.exports = router;
