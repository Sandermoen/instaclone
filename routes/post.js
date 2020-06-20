const express = require('express');
const postRouter = express.Router();
const multer = require('multer');
const upload = multer({
  dest: 'temp/',
  limits: { fileSize: 5 * 1024 * 1024 },
}).single('image');
const rateLimit = require('express-rate-limit');

const { requireAuth } = require('../controllers/authController');
const {
  createPost,
  retrievePost,
  votePost,
  deletePost,
  retrievePostFeed,
  retrieveSuggestedPosts,
  retrieveHashtagPosts,
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
  (req, res, next) => {
    upload(req, res, next, (err) => {
      if (err) {
        if (
          err instanceof multer.MulterError &&
          err.code === 'LIMIT_FILE_SIZE'
        ) {
          return res.status(400).send({
            error:
              'The file you are trying to upload exceeds the upload limit of 5MB.',
          });
        }
        return next(err);
      }
      next();
    });
  },
  createPost
);
postRouter.post('/:postId/vote', requireAuth, votePost);

postRouter.get('/suggested/:offset', requireAuth, retrieveSuggestedPosts);
postRouter.get('/filters', (req, res) => {
  res.send({ filters });
});
postRouter.get('/:postId', retrievePost);
postRouter.get('/feed/:offset', requireAuth, retrievePostFeed);
postRouter.get('/hashtag/:hashtag/:offset', requireAuth, retrieveHashtagPosts);

postRouter.delete('/:postId', requireAuth, deletePost);

module.exports = postRouter;
