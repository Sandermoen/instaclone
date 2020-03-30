const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FollowingSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  following: [
    {
      user: {
        type: Schema.ObjectId,
        ref: 'User'
      }
    }
  ]
});

const followingModel = mongoose.model('Following', FollowingSchema);
module.exports = followingModel;
