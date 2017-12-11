"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var cors = require("cors");
var passport = require("passport");
var mongoose = require("mongoose");
var process = require("process");
var user_route_1 = require("./routes/user.route");
var database_config_1 = require("./config/database.config");
var passport_config_1 = require("./config/passport.config");
mongoose.Promise = Promise;
//Mongoose connect
mongoose.connect(database_config_1.database.database);
//On Connect
mongoose.connection.on('connected', function () {
    console.log("Connected to database: " + database_config_1.database.database);
});
//On error
mongoose.connection.on('error', function (err) {
    console.log("Database error: " + err);
});
//Express app
var app = express();
//port number
var port = process.env.PORT || 3010;
//Enabling Cors
app.use(cors());
//Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));
//Enabling Body-Parser
app.use(bodyParser.json());
//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
passport_config_1.PassportConfig(passport);
//Adding users route
app.use('/api/user', user_route_1.UserRoutes);
//Index route
app.get('/', function (req, res) {
    res.send("Invalid endpoint");
});
app.listen(port, function () {
    console.log("Server started on port " + port);
});
//# sourceMappingURL=app.js.map