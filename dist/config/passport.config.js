"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var passport_jwt_1 = require("passport-jwt");
var user_model_1 = require("../models/user.model");
var database_config_1 = require("../config/database.config");
exports.PassportConfig = function (passport) {
    var opts = {
        jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: database_config_1.database.secret
    };
    passport.use(new passport_jwt_1.Strategy(opts, function (jwtPayload, done) {
        user_model_1.UserModel.getUserById(jwtPayload._id)
            .then(function (user) {
            if (user) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        })
            .catch(function (err) {
            return done(err, false);
        });
    }));
};
//# sourceMappingURL=passport.config.js.map