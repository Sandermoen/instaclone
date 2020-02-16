const express = require('express');
const authRouter = express.Router();
const User = require('../models/User');
const jwt = require('jwt-simple');

authRouter.post('/login', async (req, res) => {
  const { usernameOrEmail, password } = req.body;
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
      email: user.email,
      username: user.username,
      token: jwt.encode({ id: user._id }, process.env.JWT_SECRET)
    });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

authRouter.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).send({
      error: 'Please provide all the required information before registering.'
    });
  }

  try {
    const user = new User({ username, email, password });
    await user.save();
    res.status(201).send({
      email: user.email,
      username: user.username,
      token: jwt.encode({ id: user._id }, process.env.JWT_SECRET)
    });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

module.exports = authRouter;
