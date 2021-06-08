// app.js
const express = require("express");
const session = require("express-session");
const mysql = require("mysql");
const dotenv = require("dotenv");
const path = require("path");
const { check, validationResult } = require('express-validator');
const app = express();
const publicDirectory = path.join(__dirname, "./public")

// Get enviorment variables
dotenv.config({
	path: "./secure.env"
});

// Parse URL-encoded items from forms 
app.use(express.urlencoded({ extended: false }));

// Session handling
app.use(session({
	secret: process.env.SECRET,
	resave: true,
	saveUninitialized: false,
}));

// Ensure values come in as json
app.use(express.json());
// View engine hbs
app.set("view engine", "hbs");

// Database setup
const database = mysql.createConnection({
	host: process.env.HOST, // You may put an IP address instead of "localhost"
	user: process.env.USER, // Default user for MySQL, change it if needed
	password: process.env.PASSWORD, // Default password for MySQL, change it if needed
	database: 'demo-login'//process.env.DATABASE// This database needs to be setup prior
});
app.use(express.static(publicDirectory));

database.connect((error) => {
	if (error) {
		console.log(error)
	} else {
		console.log("Database Connected")
	}
})

module.exports = database; // database to be accesed by other files

// This port is arbitrarily chosen, change it in secure.env if you wish
app.listen(process.env.PORT, () => {
	console.log("Server started on port", process.env.PORT);
});

// Routes
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));
app.use((req, res) => {
	// 404 error
	res.status(404);
	req.session.login_message = "404";
	return res.send("<div style = 'text-align:center;'><h1>404</h1><br>Please return to login page.<div>");
});