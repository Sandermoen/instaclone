const express = require('express');
const authRouter = express.Router();

const {
  loginAuthentication,
  register,
  requireAuth,
  changePassword,
  githubLoginAuthentication,
} = require('../controllers/authController');

authRouter.post('/login/github', githubLoginAuthentication);
authRouter.post('/login', loginAuthentication);
authRouter.post('/register', register);

authRouter.put('/password', requireAuth, changePassword);

module.exports = authRouter;
