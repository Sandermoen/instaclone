const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  postId: String,
  userId: String,
  date: Date,
  message: String,
  commentsCount: {
    type: Number,
    default: 0
  }
});

module.exports = commentSchema;
