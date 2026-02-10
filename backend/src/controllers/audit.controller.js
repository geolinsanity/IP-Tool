const User = require('../models/user.model');
const Auth = require('../controllers/auth.controller');
const Audit = require('../models/audit.model');

exports.logAction = async (req, res) => {
    try {
        const { userID, username, sessionID } = req.user;
        const { auditAction, auditDesc, auditData } = req;
        console.log('AUDIT DATA',req.auditAction, req.auditData.data)
        const newAudit = await Audit.create({
            userID,
            username,
            sessionID,
            actionType: auditAction,
            actionDesc: auditDesc,
            recordID: auditData.data,
            oldRecord: auditData.oldRecord,
            newRecord: auditData.newRecord,
        })
    } catch (err) {
        console.error('Error logging audit action:', err);
        return res.status(500).json({ message: 'Error logging audit action', error: err.message });
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
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const { recordID, userID: queryUserID } = req.query;
        const { userRole, sessionID } = req.user;
        const isAdmin = userRole === 2 || userRole === 3;

        let filter = {};

        // For users only current session
        if (!isAdmin) {
            filter.sessionID = sessionID;
        }

        // Admins filter by recordID/IP
        if (isAdmin) {
            if(recordID) {
                filter.recordID = recordID;
            }
            
            if(queryUserID) {
                filter.userID = queryUserID
            }
        }


        // Get audit logs
        const totalRecords = await Audit.countDocuments(filter);

        const logs = await Audit.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

            const totalPages = Math.ceil(totalRecords / limit);

            return res.status(200).json({
                data: logs,
                pagination: {
                    currentPage: page,
                    limit,
                    totalRecords,
                    totalPages,
                },
            });
    } catch (err) {
        console.error('Error retrieving audit logs:', err);
        return res.status(500).json({ message: 'Error retrieving audit logs', error: err.message });
    }
}

exports.getAuditRecordIDs = async(req, res) => {
    try {
        const { userRole } = req.user;

        if(userRole !== 2 && userRole !== 3) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const records = await Audit.aggregate([
            { $match: { recordID: { $exists: true, $ne: null } } },
            { $addFields: { recordID: { $toObjectId: "$recordID" } } },//Convert string to objectID
            {
                $lookup: {
                from: 'ips',//IP collection name
                localField: 'recordID',
                foreignField: '_id',
                as: 'ipData'
                }
            },
            { $unwind: { path: '$ipData', preserveNullAndEmptyArrays: true } },
            // Group by recordID to make unique
            {
                $group: {
                _id: '$recordID',
                ip: { $first: '$ipData.ip' },
                label: { $first: '$ipData.label' }
                }
            },
            {
                $project: {
                _id: 0,
                recordID: '$_id',
                ip: 1,
                label: 1
                }
            },
            { $sort: { ip: 1 } }
        ]);
        
        return res.status(200).json({ records });
    } catch (err) {
        console.error('Error retrieving recordIDs:', err);
        return res.status(500).json({ message: 'Error fetching records', error: err.message });
    }
}

exports.getAuditUsers = async(req, res) => {
    try {
        const { userRole } = req.user;

        const users = await Audit.aggregate([
            // Distinct users in audit
            {
                $group: {
                    _id: '$userID'
                }
            },
            {
                $addFields: {
                    userObjectId: { $toObjectId: '$_id' }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userObjectId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: '$user' },
            {
                $project: {
                    _id: 0,
                    userID: '$user._id',
                    username: '$user.username'
                }
            },
            { $sort: { username: 1 } }
        ]);

        res.json({ users });

        if(userRole !== 2 && userRole !== 3) {
            return res.status(403).json({ message: 'Forbidden' });
        }

    } catch (err) {
        console.error('Error retrieving users:', err);
        return res.status(500).json({ message: 'Error fetching users', error: err.message });
    }
}
