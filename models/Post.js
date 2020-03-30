const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  image: String,
  caption: String,
  date: {
    type: Date,
    default: Date.now
  },
  author: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

const postModel = mongoose.model('Post', PostSchema);
module.exports = postModel;
