const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  date: {
    type: Date,
    default: Date.now
  },
  message: String,
  author: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  post: {
    type: Schema.ObjectId,
    ref: 'Post'
  }
});

CommentSchema.pre('deleteOne', async function(next) {
  const commentId = this.getQuery()['_id'];
  try {
    await mongoose.model('CommentVote').deleteOne({ comment: commentId });
    await mongoose
      .model('CommentReply')
      .deleteMany({ parentComment: commentId });
    next();
  } catch (err) {
    next(err);
  }
});

CommentSchema.pre('save', async function(next) {
  if (this.isNew) {
    try {
      await mongoose.model('CommentVote').create({ comment: this._id });
      next();
    } catch (err) {
      next(err);
    }
  }
  next();
});

const commentModel = mongoose.model('Comment', CommentSchema);
module.exports = commentModel;
