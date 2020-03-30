const express = require('express');
const commentRouter = express.Router();

const { requireAuth } = require('../controllers/authController');
const {
  createComment,
  deleteComment,
  voteComment,
  createCommentReply,
  deleteCommentReply,
  voteCommentReply,
  getCommentReplies
} = require('../controllers/commentController');

commentRouter.post('/:postId', requireAuth, createComment);
commentRouter.post('/:commentId/vote', requireAuth, voteComment);
commentRouter.post('/:commentReplyId/replyVote', requireAuth, voteCommentReply);
commentRouter.post('/:parentCommentId/reply', requireAuth, createCommentReply);

commentRouter.get('/:parentCommentId/:offset/replies/', getCommentReplies);

commentRouter.delete('/:commentId', requireAuth, deleteComment);
commentRouter.delete('/:commentReplyId/reply', requireAuth, deleteCommentReply);

module.exports = commentRouter;
