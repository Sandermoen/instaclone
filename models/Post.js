const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  caption: String,
  // We have to be able to identify if the user has liked this post
  // So we can't just store the amount of likes, we also have to store who liked it
  postId: String,
  likes: Array,
  replies: Array,
  date: Date,
  image: String
});

module.exports = postSchema;
