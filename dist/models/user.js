"use strict";
exports.__esModule = true;
var mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
var UserSchema = mongoose.Schema({
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
    }
});
exports.User = mongoose.model('User', UserSchema);
exports.User.getUserById = function (id, callback) {
    exports.User.findById(id, callback);
};
exports.User.getUserByUserName = function (userName, callback) {
    var query = { userName: userName };
    exports.User.findOne(query, callback);
};
exports.User.addUser = function (newUser, callback) {
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
exports.User.comparePassword = function (password, hash, callback) {
    bcrypt.compare(password, hash, function (err, isMatch) {
        if (err)
            throw err;
        callback(null, isMatch);
    });
};
//# sourceMappingURL=user.js.map