import * as express from 'express';
import { User } from '../models/user';
import { database as dbConfig } from '../config/database';
import * as passport from 'passport';
import * as jwt from 'jsonwebtoken';

export const users = express.Router();

users.post('/register', (req, res, next) => {
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        userName: req.body.userName,
        password: req.body.password,
    });

    User.addUser(newUser, (err, user) =>{
        if (err) {
            res.status(400).json({success: false, msg: `Failed to register user: ${err}`});
        }
        else {
            res.json({success: true, msg: `User registered`, data: user._id});
        }
    })
});

users.post('/authenticate', (req, res, next) => {
    const userName = req.body.userName;
    const password = req.body.password;

    User.getUserByUserName(userName, (err, user) => {
        if (err) throw err;

        if (!user) {
            return res.status(404).json({success: false, msg: 'User not found.'});
        }

        User.comparePassword(password, user.password, (err, isMatch) => {
            if (err) throw err;

            if (isMatch) {
                const token = jwt.sign(user, dbConfig.secret, {
                    expiresIn: 604800
                });

                res.json({
                    success: true,
                    token: `JWT ${token}`,
                    user: {
                        id: user._id,
                        name: user.name,
                        userName: user.userName,
                        email: user.email
                    }
                });
            }
        })
    });
});

users.get('/profile', (req, res, next) => {
    res.send('PROFILE');
});