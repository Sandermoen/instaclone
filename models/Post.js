const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  likesCount: {
    type: Number,
    default: 0
  },
  commentsCount: {
    type: Number,
    default: 0
  },
  image: String,
  caption: String,
  date: Date,
  likes: Array
});

module.exports = postSchema;
