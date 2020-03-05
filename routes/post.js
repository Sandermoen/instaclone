const express = require('express');
const postRouter = express.Router();
const multer = require('multer');
const rateLimit = require('express-rate-limit');

const { requireAuth } = require('../controllers/authController');
const {
  uploadFile,
  votePost,
  getPost
} = require('../controllers/postController');

const postLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5
});

postRouter.post(
  '/',
  postLimiter,
  requireAuth,
  multer({
    dest: 'temp/',
    limits: { fieldSize: 8 * 1024 * 1024, fileSize: 500000 }
  }).single('image'),
  uploadFile
);

postRouter.post('/:postId/vote', requireAuth, votePost);

postRouter.get('/:postId', getPost);
module.exports = postRouter;
