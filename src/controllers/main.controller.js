const Main = require('../models/main.model');
const { audit } = require('../controllers/audit.controller');

exports.getIP = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const totalRecords = await Main.countDocuments();
        const getIPs = await Main.find()
            .limit(limit)
            .skip(skip)
            .sort({ createdAt: -1 });

        const totalPages = Math.ceil(totalRecords / limit);

        return res.json({
            data: getIPs,
            pagination: {
                currentPage: page,
                limit,
                totalRecords,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        });
    } catch (err) {
        console.error('Error retrieving IPs:', err);
        return res.status(500).json({ message: 'Error retrieving IPs', error: err.message });
    }
}

exports.addIP = async(req, res) => {
    try {
        const { ip, label, comment } = req.body;

        const newRecord = await Main.create({
            ip,
            label,
            comment,
            createdBy: req.user.userID
        })

        //Audit log
        audit(req, res, 'Created', `Added new IP ${ip}`, newRecord._id.toString(), null, newRecord);

        return res.status(201).json({ message: 'New record added', data: newRecord });
    } catch (err) {
        console.error('Error adding IP:', err);
        return res.status(500).json({ message: 'Error adding IP', error: err.message });
    }
}

exports.editIP = async(req, res) => {
    try {
        const { id } = req.params;
        const { ip, label, comment } = req.body;
        const isAdmin = [2,3].includes(req.user.userRole);
        
        const getRecord = await Main.findById(id);
        if(!getRecord) {
            return res.status(404).json({ message: 'IP not found' });
        }

        if(!isAdmin && getRecord.createdBy.toString() !== req.user.userID) {
            return res.status(403).json({ message: 'You are not allowed to edit this IP' })
        }

        const newRecord = await Main.findByIdAndUpdate(
            id,
            {
                ip,
                label,
                comment,
                updatedBy: req.user.userID
            },
            { new: true, runValidators: true }
        );

        // Audit log 
        audit(req, res, 'Updated', `Modified IP ${ip}`, id, getRecord, newRecord);

        return res.status(200).json({ message: 'IP has been updated' });

    } catch (err) {
        console.error('Error updating IP:', err);
        return res.status(500).json({ message: 'Error updating IP', error: err.message });
    }
}

exports.deleteIP = async(req, res) => {
    try {
        const { id } = req.params;
        const deleteRecord = await Main.findByIdAndDelete(id);

        if(!deleteRecord) {
            return res.status(404).json({ message: 'IP record not found' });
        }

        // Audit log
        audit(req, res, 'Deleted', 'IP removed', id, deleteRecord);

        return res.status(200).json({ message: 'Record successfully deleted' });
    } catch (err) {
        console.error('Error deleting IP:', err);
        return res.status(500).json({ message: 'Error deleting IP', error: err.message });
    }
}