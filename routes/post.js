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
  retrievePostFeed,
} = require('../controllers/postController');
const filters = require('../utils/filters');

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
    limits: { fieldSize: 8 * 1024 * 1024 },
  }).single('image'),
  createPost
);
postRouter.post('/:postId/vote', requireAuth, votePost);

postRouter.get('/filters', (req, res) => {
  res.send({ filters });
});
postRouter.get('/:postId', retrievePost);
postRouter.get('/feed/:offset', requireAuth, retrievePostFeed);

postRouter.delete('/:postId', requireAuth, deletePost);

module.exports = postRouter;
