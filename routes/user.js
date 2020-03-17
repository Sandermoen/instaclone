const express = require('express');
const userRouter = express.Router();

const { retrieveUser, getBookmarks } = require('../controllers/userController');
const { requireAuth } = require('../controllers/authController');

userRouter.get('/:username', retrieveUser);
userRouter.get('/:username/bookmarks', requireAuth, getBookmarks);

module.exports = userRouter;
