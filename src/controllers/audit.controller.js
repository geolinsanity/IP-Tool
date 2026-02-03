const User = require('../models/user.model');
const Auth = require('../controllers/auth.controller');
const Audit = require('../models/audit.model');

exports.logAction = async (req, res) => {
    try {
        const { userID, username } = req.user;
        const { auditAction, auditDesc, auditData } = req;
        console.log('AUDIT DATA',req.auditAction, req.auditData.data)
        await Audit.create({
            userID,
            username,
            actionType: auditAction,
            actionDesc: auditDesc,
            recordID: auditData.data,
            oldRecord: auditData.oldRecord,
            newRecord: auditData.newRecord
        })
    } catch (err) {
        console.error(err) 
    }
}

//Call after user action
exports.audit = (req, res, action, desc, data, oldRecord = null, newRecord = null) => {
    req.auditAction = action;
    req.auditDesc = desc;
    req.auditData = {
        data,
        oldRecord: oldRecord,
        newRecord: newRecord
    };
    console.log(req.auditData)
    this.logAction(req, res).catch(console.error);
}

exports.getAuditLogs = async(req, res) => {
    try {
        const { type } = req.params;
        let query;

        // Get all audit logs
        if(type === 'all') {
            query = await Audit.find();
        } else if (type === 'grouped') {
            query = await Audit.aggregate([
                {
                    $group: {
                        _id: '$userID',
                        username: { $first: '$username' },
                        logs: { $push: '$$ROOT' },
                        total: { $sum: 1 }
                    }
                }
            ])
        } else {
            return res.status(400).json('Invalid type used')
        }

        res.status(200).json(query);
    } catch (err) {
        console.error(err)
    }
}
