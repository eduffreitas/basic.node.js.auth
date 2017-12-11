import * as express from 'express';
import { UserModel, IUser } from '../models/user.model';
import { database as dbConfig } from '../config/database.config';
import * as passport from 'passport';
import * as jwt from 'jsonwebtoken';

export const UserRoutes = express.Router();

const parseResponse = (user: any) : IUser => {
    return {
        id: user._id,
        name: user.name,
        email: user.email,
        userName: user.userName,
    }
}

UserRoutes.post('/register', (req, res, next) => {
    let newUser = new UserModel({
        name: req.body.name,
        email: req.body.email,
        userName: req.body.userName,
        password: req.body.password,
    });

    UserModel.addUser(newUser, (err, user) =>{
        if (err) {
            console.log(`Failed to register user: ${err}`);
            res.status(400).json({success: false, msg: `Failed to register user: ${err}`});

        }
        else {
            res.json({success: true, msg: 'User registered', data: parseResponse(user)});
        }
    })
});

UserRoutes.post('/authenticate', (req, res, next) => {
    const userName = req.body.userName;
    const password = req.body.password;

    UserModel.getUserByUserName(userName, (err, user) => {
        if (err) throw err;

        if (!user) {
            return res.status(404).json({success: false, msg: 'User not found.'});
        }

        UserModel.comparePassword(password, user.password, (err, isMatch) => {
            if (err) throw err;

            if (isMatch) {
                const token = jwt.sign(user, dbConfig.secret, {
                    expiresIn: 604800
                });

                res.json({
                    success: true,
                    token: `JWT ${token}`,
                    user: parseResponse(user)
                });
            }
        })
    });
});

UserRoutes.get('/profile', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    res.json(parseResponse(req.user));
});