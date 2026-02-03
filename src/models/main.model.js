const mongoose = require('mongoose');

const common = {
    type: String,
    trim: true
}

const schema = mongoose.Schema({
    ip: {
        ...common,
        required: true,
        unique: [true, 'This IP already exists']
    },
    label: {
        ...common,
        required: true
    },
    comment: {
        ...common,
        default: null
    },
    createdBy: {
        ...common,
        required: true,
        ref: 'User'
    },
    updatedBy: {
        type: String,
        ref: 'User'
    }
}, { timestamps: true });

const Main = mongoose.model('IP', schema);
module.exports = Main;