import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { User } from '../models/user';
import { database as config } from '../config/database';

export const PassportConfig = (passport) => {
    let opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeader(),
        secretOrKey: config.secret
    };

    passport.use(new JwtStrategy(opts, (jwtPayload, done) => {
        User.getUserById(jwtPayload._id, (err, user) => {
            if (err) {
                return done(err, false);
            }

            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        });

    }));

};