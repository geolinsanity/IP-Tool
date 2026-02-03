const express = require('express');
const router = express();
const User = require('../controllers/user.controller');

router.post('/signup', User.createUser);

router.post('/login', User.loginUser);

module.exports = router;