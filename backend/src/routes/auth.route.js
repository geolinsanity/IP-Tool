const express = require('express');
const router = express.Router();
const { checkToken, refreshToken } = require('../controllers/auth.controller');

router.get('/token-status', checkToken, (req, res) => {
    const expiresIn = (req.user.exp * 1000) - Date.now();
    res.json({
        valid: true,
        expiresIn: expiresIn,
        expired: expiresIn <= 0
    });
});

router.post('/refresh', checkToken, refreshToken);

module.exports = router;