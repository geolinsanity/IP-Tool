const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    role_id: {
        type: Number,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
        unique: true
    }
}, { timestamps: true });

const Role = mongoose.model('Role', schema);
module.exports = Role;