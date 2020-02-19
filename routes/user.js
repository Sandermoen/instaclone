const express = require('express');
const userRouter = express.Router();

const { retrieveUser } = require('../controllers/userController');

userRouter.get('/:username', retrieveUser);

module.exports = userRouter;
