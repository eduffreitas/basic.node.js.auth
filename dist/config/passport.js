"use strict";
exports.__esModule = true;
var passport_jwt_1 = require("passport-jwt");
var user_1 = require("../models/user");
var database_1 = require("../config/database");
exports.PassportConfig = function (passport) {
    var opts = {
        jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeader(),
        secretOrKey: database_1.database.secret
    };
    passport.use(new passport_jwt_1.Strategy(opts, function (jwtPayload, done) {
        user_1.User.getUserById(jwtPayload._doc._id, function (err, user) {
            if (err) {
                return done(err, false);
            }
            if (user) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        });
    }));
};
//# sourceMappingURL=passport.js.map