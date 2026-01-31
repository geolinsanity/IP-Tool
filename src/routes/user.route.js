const express = require('express');
const router = express();
const User = require('../controllers/user.controller');

router.get('/', (req, res, next) => {
  // if (req.params.id === '0') {
  //   return next('route')
  // }
  // res.send(`User ${req.params.id}`)
  res.send('HELLO')
})

router.post('/signup', User.createUser);

router.post('/login', User.loginUser);

router.get('/users/:id', (req, res) => {
  const userId = req.params.id;
  res.send(`User ID: ${userId}`);
});

module.exports = router;