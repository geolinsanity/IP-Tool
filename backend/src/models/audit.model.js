const mongoose = require('mongoose');

const common = {
    type: String,
    trim: true,
    required: true
}

const schema = mongoose.Schema({
    userID: {
        ...common,
        ref: 'User'
    },
    username: {
        ...common
    },
    actionType: {
        ...common,
        enum: ['Created', 'Updated', 'Deleted']
    },
    actionDesc: {
        ...common
    },
    recordID: {
        ...common,
        ref: 'IP'
    },
    oldRecord: {
        type: mongoose.Schema.Types.Mixed,
        default: null
    },
    newRecord: {
        type: mongoose.Schema.Types.Mixed,
        default: null
    }
}, { timestamps: true });

const Audit = mongoose.model('Audit', schema);
module.exports = Audit;