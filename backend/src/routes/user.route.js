const express = require('express');
const router = express();
const User = require('../controllers/user.controller');
const { checkToken } = require('../controllers/auth.controller');

router.post('/signup', User.createUser);

router.post('/login', User.loginUser);

router.post('/logout', User.logoutUser);

router.get('/', checkToken, (req, res) => {
    res.json(req.user)
});

module.exports = router;