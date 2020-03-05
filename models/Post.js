const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  username: String,
  posts: {
    type: Map,
    default: {}
  }
});

const postModel = mongoose.model('post', postSchema);

module.exports = postModel;
