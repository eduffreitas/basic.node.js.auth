"use strict";
exports.__esModule = true;
var express = require("express");
var user_1 = require("../models/user");
var database_1 = require("../config/database");
var jwt = require("jsonwebtoken");
exports.users = express.Router();
exports.users.post('/register', function (req, res, next) {
    var newUser = new user_1.User({
        name: req.body.name,
        email: req.body.email,
        userName: req.body.userName,
        password: req.body.password
    });
    user_1.User.addUser(newUser, function (err, user) {
        if (err) {
            res.status(400).json({ success: false, msg: "Failed to register user: " + err });
        }
        else {
            res.json({ success: true, msg: "User registered", data: user._id });
        }
    });
});
exports.users.post('/authenticate', function (req, res, next) {
    var userName = req.body.userName;
    var password = req.body.password;
    user_1.User.getUserByUserName(userName, function (err, user) {
        if (err)
            throw err;
        if (!user) {
            return res.status(404).json({ success: false, msg: 'User not found.' });
        }
        user_1.User.comparePassword(password, user.password, function (err, isMatch) {
            if (err)
                throw err;
            if (isMatch) {
                var token = jwt.sign(user, database_1.database.secret, {
                    expiresIn: 604800
                });
                res.json({
                    success: true,
                    token: "JWT " + token,
                    user: {
                        id: user._id,
                        name: user.name,
                        userName: user.userName,
                        email: user.email
                    }
                });
            }
        });
    });
});
exports.users.get('/profile', function (req, res, next) {
    res.send('PROFILE');
});
//# sourceMappingURL=users.js.map