const express = require('express');
const authRouter = express.Router();

const {
  requireAuth,
  loginAuthentication,
  register
} = require('../controllers/authController');

authRouter.get('/', requireAuth, (req, res) => {
  res.send('hello welcome');
});

authRouter.post('/login', loginAuthentication);

authRouter.post('/register', register);

module.exports = authRouter;
