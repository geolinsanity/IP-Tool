const mongoose = require('mongoose');

const common = {
    type: String,
    required: true,
    trim: true
}

const schema = mongoose.Schema({
    username: {
        ...common,
        unique: [true, 'Username already existt']
    },
    password: {
        ...common
    },
    // email: {
    //     ...common,
    //     unique: [true, 'Email already existt']
    // },
    role_id: {
        type: Number,
        ref: 'Role',
        required: true
    }
}, { timestamps: true });

const User = mongoose.model('User', schema);
module.exports = User;