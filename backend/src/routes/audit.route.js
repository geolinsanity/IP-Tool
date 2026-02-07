const express = require('express');
const router = express();
const Audit = require('../controllers/audit.controller');
const { checkToken } = require('../controllers/auth.controller');

router.get('/:type', checkToken, Audit.getAuditLogs);

module.exports = router;