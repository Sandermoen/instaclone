const express = require('express');
const postRouter = express.Router();
const multer = require('multer');
const rateLimit = require('express-rate-limit');

const { requireAuth } = require('../controllers/authController');
const {
  createPost,
  retrievePost,
  votePost,
  deletePost,
} = require('../controllers/postController');

const postLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
});

postRouter.post(
  '/',
  postLimiter,
  requireAuth,
  multer({
    dest: 'temp/',
    limits: { fieldSize: 8 * 1024 * 1024, fileSize: 1000000 },
  }).single('image'),
  createPost
);
postRouter.post('/:postId/vote', requireAuth, votePost);

postRouter.get('/:postId', retrievePost);
module.exports = postRouter;

postRouter.delete('/:postId', requireAuth, deletePost);
