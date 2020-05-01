const express = require('express');
const userRouter = express.Router();

const {
  retrieveUser,
  retrievePosts,
  bookmarkPost,
  followUser,
  retrieveFollowing,
  retrieveFollowers,
  searchUsers,
  confirmUser,
} = require('../controllers/userController');
const { requireAuth, optionalAuth } = require('../controllers/authController');

userRouter.get('/:username', optionalAuth, retrieveUser);
userRouter.get('/:username/posts/:offset', retrievePosts);
userRouter.get('/:userId/:offset/following', requireAuth, retrieveFollowing);
userRouter.get('/:userId/:offset/followers', requireAuth, retrieveFollowers);
userRouter.get('/:username/:offset/search', searchUsers);

userRouter.put('/confirm', requireAuth, confirmUser);

userRouter.post('/:postId/bookmark', requireAuth, bookmarkPost);
userRouter.post('/:userId/follow', requireAuth, followUser);

module.exports = userRouter;
