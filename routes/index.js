const express = require('express');
const authRouter = require('./auth');
const userRouter = require('./user');
const postRouter = require('./post');
const commentRouter = require('./comment');
const apiRouter = express.Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/user', userRouter);
apiRouter.use('/post', postRouter);
apiRouter.use('/comment', commentRouter);

module.exports = apiRouter;
