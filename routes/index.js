const express = require('express');
const authRouter = require('./auth');
const apiRouter = express.Router();

apiRouter.use('/auth', authRouter);

module.exports = apiRouter;
