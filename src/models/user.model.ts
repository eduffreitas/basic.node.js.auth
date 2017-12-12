import * as mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { Promise } from 'es6-promise';

export interface IUser {
    id: string,
    name: string,
    email: string,
    userName: string
}

const UserModelSchema = mongoose.Schema({
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

export const UserModel = mongoose.model('UserModel', UserModelSchema);

UserModel.getUserById = (id) => {
    return UserModel.findById(id).exec();
}

UserModel.getUserByUserName = (userName) => {
    const query = { userName: userName}
    return UserModel.findOne(query);
}

UserModel.addUser = (newUser) => {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(10, (err, salt) => {
            if (err) reject(err);

            resolve(new Promise((innerResolve, innerReject) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) innerReject(err);

                    newUser.password = hash;
                    innerResolve(newUser.save());
                });
            }));
        })
    });
}

UserModel.comparePassword = (password, hash) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, hash, (err, isMatch) => {
            if (err) reject(err);

            resolve(isMatch);
        });
    });
}