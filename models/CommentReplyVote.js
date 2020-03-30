const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentReplyVoteSchema = new Schema({
  comment: {
    type: Schema.ObjectId,
    ref: 'CommentReply'
  },
  votes: [
    {
      author: {
        type: Schema.ObjectId,
        ref: 'User'
      }
    }
  ]
});

const commentReplyVoteModel = mongoose.model(
  'CommentReplyVote',
  CommentReplyVoteSchema
);
module.exports = commentReplyVoteModel;
