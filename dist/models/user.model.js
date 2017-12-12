"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
var es6_promise_1 = require("es6-promise");
var UserModelSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
});
exports.UserModel = mongoose.model('UserModel', UserModelSchema);
exports.UserModel.getUserById = function (id) {
    return exports.UserModel.findById(id).exec();
};
exports.UserModel.getUserByUserName = function (userName) {
    var query = { userName: userName };
    return exports.UserModel.findOne(query).exec();
};
exports.UserModel.addUser = function (newUser) {
    return new es6_promise_1.Promise(function (resolve, reject) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err)
                reject(err);
            resolve(new es6_promise_1.Promise(function (innerResolve, innerReject) {
                bcrypt.hash(newUser.password, salt, function (err, hash) {
                    if (err)
                        innerReject(err);
                    newUser.password = hash;
                    innerResolve(newUser.save());
                });
            }));
        });
    });
};
exports.UserModel.comparePassword = function (password, hash) {
    return new es6_promise_1.Promise(function (resolve, reject) {
        bcrypt.compare(password, hash, function (err, isMatch) {
            if (err)
                reject(err);
            resolve(isMatch);
        });
    });
};
//# sourceMappingURL=user.model.js.map