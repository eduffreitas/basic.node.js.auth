import * as mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';

const UserSchema = mongoose.Schema({
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

export const User = mongoose.model('User', UserSchema);

User.getUserById = (id, callback) => {
    User.findById(id, callback);
}

User.getUserByUserName = (userName, callback) => {
    const query = { userName: userName}
    User.findOne(query, callback);
}

User.addUser = (newUser, callback) => {
    bcrypt.genSalt(10, (err, salt) => {
        if (err) throw err;
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

User.comparePassword = (password, hash, callback) => {
    bcrypt.compare(password, hash, (err, isMatch) => {
        if (err) throw err;
        callback(null, isMatch);
    });
}