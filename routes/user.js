const express = require('express');
const userRouter = express.Router();

const {
  retrieveUser,
  retrievePosts,
  bookmarkPost,
} = require('../controllers/userController');
const { requireAuth } = require('../controllers/authController');

userRouter.get('/:username', retrieveUser);
userRouter.get('/:username/posts/:offset', retrievePosts);

userRouter.post('/:postId/bookmark', requireAuth, bookmarkPost);

module.exports = userRouter;
