const jwt = require('jwt-simple');
const User = require('../models/User');
const Post = require('../models/Post');

module.exports.verifyJwt = token => {
  return new Promise(async (resolve, reject) => {
    try {
      const id = jwt.decode(token, process.env.JWT_SECRET).id;
      const user = await User.findByTokenId(id);
      if (user) {
        return resolve(user);
      }
    } catch (err) {
      return reject('Not authorized');
    }
  });
};

module.exports.requireAuth = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).send({ error: 'Not authorized' });
  try {
    await this.verifyJwt(authorization);
    return next();
  } catch (err) {
    return res.status(401).send({ error: err });
  }
};

module.exports.loginAuthentication = async (req, res, next) => {
  const { authorization } = req.headers;
  const { usernameOrEmail, password } = req.body;
  if (authorization) {
    try {
      const user = await this.verifyJwt(authorization);
      return res.send({
        user: {
          email: user.email,
          username: user.username,
          avatar: user.avatar
        },
        token: authorization
      });
    } catch (err) {
      return res.status(401).send({ error: err });
    }
  }

  if (!usernameOrEmail || !password) {
    return res
      .status(400)
      .send({ error: 'Please provide both a username/email and a password.' });
  }

  try {
    const user = await User.findByCredentials(usernameOrEmail, password);
    if (!user) {
      return res.status(401).send({
        error: 'The credentials you provided are incorrect, please try again.'
      });
    }
    res.send({
      user: {
        email: user.email,
        username: user.username,
        avatar: user.avatar
      },
      token: jwt.encode({ id: user._id }, process.env.JWT_SECRET)
    });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

module.exports.register = async (req, res, next) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).send({
      error: 'Please provide all the required information before registering.'
    });
  }

  try {
    const user = new User({ username, email, password });
    await user.save();
    const post = new Post({ username });
    await post.save();
    res.status(201).send({
      user: {
        email: user.email,
        username: user.username
      },
      token: jwt.encode({ id: user._id }, process.env.JWT_SECRET)
    });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};
