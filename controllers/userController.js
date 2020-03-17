const User = require('../models/User');

module.exports.retrieveUser = async (req, res, next) => {
  const { username } = req.params;
  try {
    const user = await User.findByUsername(username);
    const { avatar, bio, followers, following, posts } = user;
    res.send({
      username,
      avatar,
      bio,
      followersCount: followers.length,
      followingCount: following.length,
      postCount: posts.length,
      posts
    });
  } catch (err) {
    res.status(404).send(err.message);
  }
};

module.exports.getBookmarks = async (req, res, next) => {
  const user = res.locals.user;
  try {
    const response = await User.findOne({ _id: user._id }, 'bookmarks');
    res.send(response.bookmarks);
  } catch (err) {
    next(err);
  }
};
