"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var user_model_1 = require("../models/user.model");
var database_config_1 = require("../config/database.config");
var passport = require("passport");
var jwt = require("jsonwebtoken");
exports.UserRoutes = express.Router();
var parseResponse = function (user) {
    return {
        id: user._id,
        name: user.name,
        email: user.email,
        userName: user.userName,
    };
};
exports.UserRoutes.post('/register', function (req, res, next) {
    var newUser = new user_model_1.UserModel({
        name: req.body.name,
        email: req.body.email,
        userName: req.body.userName,
        password: req.body.password,
    });
    user_model_1.UserModel.addUser(newUser)
        .then(function (user) {
        res.json({ success: true, msg: 'User registered', data: parseResponse(user) });
    })
        .catch(function (err) {
        console.log("Failed to register user: " + err);
        res.status(400).json({ success: false, msg: "Failed to register user: " + err });
    });
});
exports.UserRoutes.post('/authenticate', function (req, res, next) {
    var userName = req.body.userName;
    var password = req.body.password;
    user_model_1.UserModel.getUserByUserName(userName)
        .then(function (err, user) {
        if (!user) {
            return res.status(404).json({ success: false, msg: 'User not found.' });
        }
        user_model_1.UserModel.comparePassword(password, user.password)
            .then(function (isMatch) {
            if (isMatch) {
                var token = jwt.sign(user, database_config_1.database.secret, {
                    expiresIn: 604800
                });
                res.json({
                    success: true,
                    token: "JWT " + token,
                    user: parseResponse(user)
                });
            }
        })
            .catch(function (err) {
            console.log("An error ocurred while comparing the user password " + err);
            res.status(500).json({ success: false, msg: 'Internal Server Error.' });
        });
    })
        .catch(function (err) {
        console.log("An error ocurred while saving the user " + err);
        res.status(500).json({ success: false, msg: 'Internal Server Error.' });
    });
});
exports.UserRoutes.get('/profile', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    res.json(parseResponse(req.user));
});
//# sourceMappingURL=user.route.js.map