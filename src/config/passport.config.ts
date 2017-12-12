import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { UserModel } from '../models/user.model';
import { database as config } from '../config/database.config';

export const PassportConfig = (passport) => {
    let opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.secret
    };

    passport.use(new JwtStrategy(opts, (jwtPayload, done) => {
        UserModel.getUserById(jwtPayload._doc._id)
            .then((user) => {
                if (user) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            })
            .catch((err) => {
                return done(err, false);
            });
    }));

};