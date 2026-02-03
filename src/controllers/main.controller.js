const Main = require('../models/main.model');
const { audit } = require('../controllers/audit.controller');

exports.getIP = async (req, res) => {
    try {
        const getIPs = await Main.find()
        return res.json(getIPs);
    } catch (err) {
        console.error(err)
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

        return res.status(201).json('New IP added');
    } catch (err) {
        console.error(err)
        return res.status(500).json(err.message)
    }
}

exports.editIP = async(req, res) => {
    try {
        const { id } = req.params;
        const { ip, label, comment } = req.body;
        const isAdmin = [2,3].includes(req.user.userRole);
        
        const getRecord = await Main.findById(id);
        if(!getRecord) {
            return res.status(404).json('IP not found');
        }

        if(!isAdmin && getRecord.createdBy.toString() !== req.user.userID) {
            return res.status(403).json('You are not allowed to edit this IP')
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

        return res.status(200).json('IP has been updated');

    } catch (err) {
        console.error(err)
        return res.status(500).json(err.message)
    }
}

exports.deleteIP = async(req, res) => {
    try {
        const { id } = req.params;
        const deleteRecord = await Main.findByIdAndDelete(id);

        if(!deleteRecord) {
            return res.status(404).json('IP record not found');
        }

        // Audit log
        audit(req, res, 'Deleted', 'IP removed', id, deleteRecord);

        return res.status(200).json('Record successfully deleted')
    } catch (err) {
        console.error(err)
        return res.status(500).json(err.message)
    }
}