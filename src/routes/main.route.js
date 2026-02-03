const express = require('express');
const router = express();
const Main = require('../controllers/main.controller');
const { checkToken, isUser, isAdmin } = require('../controllers/auth.controller');

router.post('/add', [checkToken, isUser], Main.addIP);

router.put('/edit/:id', checkToken, Main.editIP);

router.delete('/delete/:id', [checkToken, isAdmin], Main.deleteIP);

router.get('/list', checkToken, Main.getIP);


module.exports = router;