const express = require('express');
const userRouter = express.Router();
const multer = require('multer');

const {
  retrieveUser,
  retrievePosts,
  bookmarkPost,
  followUser,
  retrieveFollowing,
  retrieveFollowers,
  searchUsers,
  confirmUser,
  changeAvatar,
  removeAvatar,
  updateProfile,
  retrieveSuggestedUsers,
} = require('../controllers/userController');
const { requireAuth, optionalAuth } = require('../controllers/authController');

userRouter.get('/suggested/:max?', requireAuth, retrieveSuggestedUsers);
userRouter.get('/:username', optionalAuth, retrieveUser);
userRouter.get('/:username/posts/:offset', retrievePosts);
userRouter.get('/:userId/:offset/following', requireAuth, retrieveFollowing);
userRouter.get('/:userId/:offset/followers', requireAuth, retrieveFollowers);
userRouter.get('/:username/:offset/search', searchUsers);

userRouter.put('/confirm', requireAuth, confirmUser);
userRouter.put(
  '/avatar',
  requireAuth,
  multer({
    dest: 'temp/',
    limits: { fieldSize: 8 * 1024 * 1024, fileSize: 1000000 },
  }).single('image'),
  changeAvatar
);
userRouter.put('/', requireAuth, updateProfile);

userRouter.delete('/avatar', requireAuth, removeAvatar);

userRouter.post('/:postId/bookmark', requireAuth, bookmarkPost);
userRouter.post('/:userId/follow', requireAuth, followUser);

module.exports = userRouter;
