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
    user_model_1.UserModel.addUser(newUser, function (err, user) {
        if (err) {
            console.log("Failed to register user: " + err);
            res.status(400).json({ success: false, msg: "Failed to register user: " + err });
        }
        else {
            res.json({ success: true, msg: 'User registered', data: parseResponse(user) });
        }
    });
});
exports.UserRoutes.post('/authenticate', function (req, res, next) {
    var userName = req.body.userName;
    var password = req.body.password;
    user_model_1.UserModel.getUserByUserName(userName, function (err, user) {
        if (err)
            throw err;
        if (!user) {
            return res.status(404).json({ success: false, msg: 'User not found.' });
        }
        user_model_1.UserModel.comparePassword(password, user.password, function (err, isMatch) {
            if (err)
                throw err;
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
        });
    });
});
exports.UserRoutes.get('/profile', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    res.json(parseResponse(req.user));
});
//# sourceMappingURL=user.route.js.map