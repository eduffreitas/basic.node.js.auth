"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
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
exports.UserModel.getUserById = function (id, callback) {
    exports.UserModel.findById(id, callback);
};
exports.UserModel.getUserByUserName = function (userName, callback) {
    var query = { userName: userName };
    exports.UserModel.findOne(query, callback);
};
exports.UserModel.addUser = function (newUser, callback) {
    bcrypt.genSalt(10, function (err, salt) {
        if (err)
            throw err;
        bcrypt.hash(newUser.password, salt, function (err, hash) {
            if (err)
                throw err;
            newUser.password = hash;
            newUser.save(callback);
        });
    });
};
exports.UserModel.comparePassword = function (password, hash, callback) {
    bcrypt.compare(password, hash, function (err, isMatch) {
        if (err)
            throw err;
        callback(null, isMatch);
    });
};
//# sourceMappingURL=user.model.js.map