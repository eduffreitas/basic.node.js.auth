import * as mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';

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

UserModel.getUserById = (id, callback) => {
    UserModel.findById(id, callback);
}

UserModel.getUserByUserName = (userName, callback) => {
    const query = { userName: userName}
    UserModel.findOne(query, callback);
}

UserModel.addUser = (newUser, callback) => {
    bcrypt.genSalt(10, (err, salt) => {
        if (err) throw err;
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

UserModel.comparePassword = (password, hash, callback) => {
    bcrypt.compare(password, hash, (err, isMatch) => {
        if (err) throw err;
        callback(null, isMatch);
    });
}