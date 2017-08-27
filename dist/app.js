"use strict";
exports.__esModule = true;
var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var cors = require("cors");
var passport = require("passport");
var mongoose = require("mongoose");
var users_1 = require("./routes/users");
var database_1 = require("./config/database");
var passport_1 = require("./config/passport");
//Mongoose connect
mongoose.connect(database_1.database.database);
//On Connect
mongoose.connection.on('connected', function () {
    console.log("Connected to database: " + database_1.database.database);
});
//On error
mongoose.connection.on('error', function (err) {
    console.log("Database error: " + err);
});
//Express app
var app = express();
//port number
var port = 3000;
//Enabling Cors
app.use(cors());
//Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));
//Enabling Body-Parser
app.use(bodyParser.json());
//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
passport_1.PassportConfig(passport);
//Adding users route
app.use('/api/users', users_1.users);
//Index route
app.get('/', function (req, res) {
    res.send("Invalid endpoint");
});
app.listen(port, function () {
    console.log("Server started on port " + port);
});
//# sourceMappingURL=app.js.map