// pages.js
// Javascript file for routing to pages
const express = require('express');
//const { delete } = require('./auth');
const router = express.Router();

// Login page
router.get("/", (req, res) => {
	// Load page
	res.render("login", {
		message: req.session.login_message
	});
	// Delete messages
	delete req.session.login_message;
	res.status(200);
});

// Register page
router.get("/register", (req, res) => {
	res.render("register", {
		message: req.session.register_message
	});

	delete req.session.register_message;
	res.status(200);
});

// Secure page
router.get("/secure", (req, res) => {
	if (!req.session.user) {
		// Redirect to login if not loged in
		res.status(403);
		req.session.login_message = "Login required";
		return res.redirect("/");
	} else {
		res.render("secure", {
			user: req.session.user
		});
		res.status(200);
	}
	
});

module.exports = router;