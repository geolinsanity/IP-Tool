const express = require('express');
const router = express();
const Audit = require('../controllers/audit.controller');
const { checkToken } = require('../controllers/auth.controller');

router.get('/get-logs', checkToken, Audit.getAuditLogs);

router.get('/get/record-IDs', checkToken, Audit.getAuditRecordIDs);

router.get('/get/users', checkToken, Audit.getAuditUsers);

module.exports = router;