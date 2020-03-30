const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostVoteSchema = new Schema({
  post: {
    type: Schema.ObjectId,
    ref: 'Post'
  },
  votes: [{ author: { type: Schema.ObjectId, ref: 'User' } }]
});

const postVoteModel = mongoose.model('PostVote', PostVoteSchema);

module.exports = postVoteModel;
