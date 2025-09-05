const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js")

// signup
router.route("/signup")
.get(userController.renderSignup)
.post( wrapAsync(userController.signup))


// login
router.route("/login")
.get(userController.renderLogin)

// post request for user authentication
// this authentication will be done with the help of passport middleware
.post( saveRedirectUrl, passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), userController.login); //actual login is done by passport this is post login


// logout   
router.get("/logout", userController.logout)

module.exports = router;