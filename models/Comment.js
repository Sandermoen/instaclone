const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  postId: String,
  userId: String,
  date: Date,
  message: String,
  commentCount: {
    type: Number,
    default: 0
  }
});

module.exports = commentSchema;
