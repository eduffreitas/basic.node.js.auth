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

    UserModel.addUser(newUser)
        .then((user) =>{
            res.json({success: true, msg: 'User registered', data: parseResponse(user)});
        })
        .catch((err) => {
            console.log(`Failed to register user: ${err}`);
            res.status(400).json({success: false, msg: `Failed to register user: ${err}`});
        });
});

UserRoutes.post('/authenticate', (req, res, next) => {
    const userName = req.body.userName;
    const password = req.body.password;

    UserModel.getUserByUserName(userName)
        .then((user) => {
            if (!user) {
                res.status(404).json({success: false, msg: 'User not found.'});
                return;
            }        

            UserModel.comparePassword(password, user.password)
                .then((isMatch) => {
    
                    if (isMatch) {
                        const token = jwt.sign(user.toJSON(), dbConfig.secret, {
                            expiresIn: 604800
                        });
    
                        res.json({
                            success: true,
                            token: `JWT ${token}`,
                            user: parseResponse(user)
                        });
                    }
                    else {
                        res.status(400).json({
                            success: false,
                            msg: "Failed to authenticate"
                        });
                    }
                    
                })
                .catch((err) => {
                    console.log(`An error ocurred while comparing the user password ${err}`);
                    res.status(500).json({success: false, msg: 'Internal Server Error.'});
                })
        })
        .catch((err) => {
            console.log(`An error ocurred while saving the user ${err}`);
            res.status(500).json({success: false, msg: 'Internal Server Error.'});            
        });
});

UserRoutes.get('/profile', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    res.json(parseResponse(req.user));
});