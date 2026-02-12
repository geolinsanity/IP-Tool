const Main = require('../models/main.model');
const Audit = require('../models/audit.model');

exports.logAction = async (req, res) => {
    try {
        const { userID, username, sessionID } = req.user;
        const { auditAction, auditDesc, auditData } = req;
        console.log('AUDIT DATA',req.auditAction, req.auditData.data)
        await Audit.create({
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
    } catch (err) {
        console.error('Error retrieving users:', err);
        return res.status(500).json({ message: 'Error fetching users', error: err.message });
    }
}

exports.getAllActionCount = async(req, res) => {
    try {
        const counts = await Audit.aggregate([
            {
                $group: {
                    _id: '$actionType',
                    count: { $sum: 1 }
                }
            },
            {
                $group: {
                    _id: null,
                    totalActions: { $sum: '$count' },
                    counts: {
                        $push: {
                            k: '$_id',
                            v: '$count'
                        }
                    }
                }
            },
            {
                $addFields: {
                    countsObj: { $arrayToObject: '$counts' }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalActions: 1,
                    created: { $ifNull: ['$countsObj.Created', 0] },
                    updated: { $ifNull: ['$countsObj.Updated', 0] },
                    deleted: { $ifNull: ['$countsObj.Deleted', 0] }
                }
            }
        ]);
        res.json(counts[0]);
    } catch (err) {
        console.error('Error retrieving action counts:', err);
        return res.status(500).json({ message: 'Error fetching action counts', error: err.message });
    }
}

exports.getActionsOverTime = async(req, res) => {
    try {
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

        const rawData = await Audit.aggregate([
            {
            $match: {
                createdAt: { $gte: firstDayOfMonth, $lte: lastDayOfMonth }
            }
            },
            {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                Created: { $sum: { $cond: [{ $eq: ["$actionType", "Created"] }, 1, 0] } },
                Updated: { $sum: { $cond: [{ $eq: ["$actionType", "Updated"] }, 1, 0] } },
                Deleted: { $sum: { $cond: [{ $eq: ["$actionType", "Deleted"] }, 1, 0] } },
            }
            },
            { $sort: { "_id": 1 } }
        ]);

        const chartData = {
            labels: rawData.map(d => d._id),
            datasets: [
                { label: 'Created', data: rawData.map(d => d.Created), backgroundColor: '#B3CC57' },
                { label: 'Updated', data: rawData.map(d => d.Updated), backgroundColor: '#FEBD3B' },
                { label: 'Deleted', data: rawData.map(d => d.Deleted), backgroundColor: '#EF746F' }
            ]
        };

        console.log(chartData)
        res.json(chartData);
    } catch (err) {
        console.error('Error retrieving action over time:', err);
        return res.status(500).json({ message: 'Error fetching action over time', error: err.message });
    }
}

exports.getIPCount = async(req, res) => {
    try {
        const ipCounts = await Main.aggregate([{
            $group: {
                _id: null,
                ipv4: {
                    $sum: {
                        $cond: [
                            {
                                $regexMatch: {
                                    input: "$ip",
                                    regex: /^(\b25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}\b$/
                                }
                            },
                            1,
                            0
                        ]
                    }
                },
                ipv6: {
                    $sum: {
                        $cond: [
                            {
                                $regexMatch: {
                                    input: "$ip",
                                    regex: /^([0-9a-fA-F]{1,4}:){1,7}[0-9a-fA-F]{1,4}$/
                                }
                            },
                            1,
                            0
                        ]
                    }
                }
            }}
        ]);

        const ipv4 = ipCounts[0]?.ipv4 || 0;
        const ipv6 = ipCounts[0]?.ipv6 || 0;
        const totalRecords = ipv4 + ipv6;

        const chartData = {
            labels: ['IPv4', 'IPv6'],
            datasets: [
                { data: [ipv4, ipv6], backgroundColor: ['#495B85', '#5A9A9C'] }
            ]
        };

        res.json({chartData, totalRecords});
    } catch (err) {
        console.error('Error retrieving ip counts:', err);
        return res.status(500).json({ message: 'Error fetching ip counts', error: err.message });
    }
}

exports.getRecentAction = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;

        const recentActions = await Audit.find({})
        .sort({ createdAt: -1 })
        .limit(limit)
        .select('actionType actionDesc createdAt username -_id');

        res.json(recentActions);
    } catch (err) {
        console.error('Error retrieving recent actions:', err);
        return res.status(500).json({ message: 'Error fetching recent actions', error: err.message });
    }
}