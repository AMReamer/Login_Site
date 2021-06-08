// auth.js
// Javascript file for routing to secure pages and user authentication
const express = require('express');
const router = express.Router();
const database = require('../app');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');

// Login controller
login = async (req, res) => {

	const { username, password } = req.body;

	res.status(202);

	try {
		database.query("SELECT * FROM users WHERE username = ?", [username], async (error, results) => {
			
			if (results.length == 1 && await bcrypt.compare(password, results[0].password)) {
				req.session.user = results[0].username; // Use registered capitalization
				return res.redirect("/secure");
			}
			else {
				req.session.login_message = "Incorrect username or password";
				return res.redirect("/");
			}

		});

	} catch (error) {
		res.status(400);
		console.log(error);
		req.session.login_message = "Could not login";
		return res.redirect("/");
	}
};

logout = async (req, res) => {
	// End session
	req.session.destroy();
	res.redirect("/");
};

// Register controller
register = (req, res) => {

	const { username, password, confirm } = req.body;

	res.status(202);

	database.query("SELECT username FROM users WHERE username = ?", [username], async (error, results) => {
		if (error) {
			res.status(400);
			console.log(error);
			req.session.register_message = "Could not create user";
			return res.redirect("/register");
		}

		if (results.length > 0) {
			res.status(400);
			req.session.register_message = "User already exist";
			return res.redirect("/register");
		}
		else if (password != confirm) {
			res.status(400);
			req.session.register_message = "Password does not match confirmed password";
			return res.redirect("/register");
		}
		else {
			let hashedPwd = await bcrypt.hash(password, 8); // hashed password

			database.query("INSERT INTO users SET ?", { username: username, password: hashedPwd }, (error, result) => {
				if (error) {
					res.status(400);
					console.log(error);
					req.session.register_message = "Could not create user";
					return res.redirect("/register");
				}
				else {
					return res.redirect("/");
				}
			});
		}
	});
};

// Authentication routers with basic sanitization
router.post("/login", [check("username").trim().escape()], login);
router.post("/logout", logout);
router.post("/register", [check("username").trim().escape()], register);

module.exports = router;