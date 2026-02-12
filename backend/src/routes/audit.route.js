const express = require('express');
const router = express();
const Audit = require('../controllers/audit.controller');
const { checkToken, isAdmin } = require('../controllers/auth.controller');

router.get('/get-logs', checkToken, Audit.getAuditLogs);

router.get('/get/record-IDs', [checkToken, isAdmin], Audit.getAuditRecordIDs);

router.get('/get/users', [checkToken, isAdmin], Audit.getAuditUsers);

// Fpr dashboard

router.get('/get-action-count', [checkToken, isAdmin], Audit.getAllActionCount);

router.get('/get-action-over-time', [checkToken, isAdmin], Audit.getActionsOverTime);

router.get('/get-ip-count', [checkToken, isAdmin], Audit.getIPCount);

router.get('/get-recent-actions', [checkToken, isAdmin], Audit.getRecentAction);

module.exports = router;