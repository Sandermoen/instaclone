const express = require('express');
const postRouter = express.Router();
const multer = require('multer');

const { requireAuth } = require('../controllers/authController');
const { uploadFile } = require('../controllers/postController');

postRouter.post(
  '/',
  requireAuth,
  multer({
    dest: 'temp/',
    limits: { fieldSize: 8 * 1024 * 1024, fileSize: 500000 }
  }).single('image'),
  uploadFile
);

module.exports = postRouter;
