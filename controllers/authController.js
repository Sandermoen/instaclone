const fs = require('fs');
const handlebars = require('handlebars');
const jwt = require('jwt-simple');
const crypto = require('crypto');
const User = require('../models/User');
const ConfirmationToken = require('../models/ConfirmationToken');
const bcrypt = require('bcrypt');

const { sendEmail } = require('./utils');

module.exports.verifyJwt = (token) => {
  return new Promise(async (resolve, reject) => {
    try {
      const id = jwt.decode(token, process.env.JWT_SECRET).id;
      const user = await User.findOne(
        { _id: id },
        'email username avatar bookmarks'
      );
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
  if (!authorization) return res.status(401).send({ error: 'Not authorized.' });
  try {
    const user = await this.verifyJwt(authorization);
    // Allow other middlewares to access the authenticated user details.
    res.locals.user = user;
    return next();
  } catch (err) {
    return res.status(401).send({ error: err });
  }
};

module.exports.optionalAuth = async (req, res, next) => {
  const { authorization } = req.headers;
  if (authorization) {
    try {
      const user = await this.verifyJwt(authorization);
      // Allow other middlewares to access the authenticated user details.
      res.locals.user = user;
    } catch (err) {
      return res.status(401).send({ error: err });
    }
  }
  return next();
};

module.exports.loginAuthentication = async (req, res, next) => {
  const { authorization } = req.headers;
  const { usernameOrEmail, password } = req.body;
  if (authorization) {
    try {
      const user = await this.verifyJwt(authorization);
      return res.send({
        user,
        token: authorization,
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
    const user = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });
    if (!user) {
      return res.status(401).send({
        error: 'The credentials you provided are incorrect, please try again.',
      });
    }

    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        return next(err);
      }
      if (!result) {
        return res.status(401).send({
          error:
            'The credentials you provided are incorrect, please try again.',
        });
      }

      res.send({
        user: {
          _id: user._id,
          email: user.email,
          username: user.username,
          avatar: user.avatar,
        },
        token: jwt.encode({ id: user._id }, process.env.JWT_SECRET),
      });
    });
  } catch (err) {
    next(err);
  }
};

module.exports.register = async (req, res, next) => {
  const { username, fullName, email, password } = req.body;
  let user = null;
  let confirmationToken = null;
  if (!username || !fullName || !email || !password) {
    return res.status(400).send({
      error: 'Please provide all the required information before registering.',
    });
  }

  if (
    !email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
  ) {
    return res.status(400).send({ error: 'Enter a valid email address.' });
  }

  if (username.length > 30 || username.length < 3) {
    return res.status(400).send({
      error: 'Please choose a username between 3 and 30 characters.',
    });
  } else if (!username.match(/^[a-zA-Z0-9\_.]+$/)) {
    return res.status(400).send({
      error:
        'A username can only contain the following: letters A-Z, numbers 0-9 and the symbols _ . ',
    });
  }

  if (password.length < 6) {
    return res.status(400).send({
      error:
        'For security purposes we require a password to be at least 6 characters.',
    });
  } else if (
    !password.match(/^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{6,}$/)
  ) {
    return res.status(400).send({
      error:
        'A password needs to have at least one uppercase letter, one lowercase letter, one special character and one number.',
    });
  }

  try {
    user = new User({ username, fullName, email, password });
    confirmationToken = new ConfirmationToken({
      user: user._id,
      token: crypto.randomBytes(20).toString('hex'),
    });
    await user.save();
    await confirmationToken.save();
    res.status(201).send({
      user: {
        email: user.email,
        username: user.username,
      },
      token: jwt.encode({ id: user._id }, process.env.JWT_SECRET),
    });
  } catch (err) {
    next(err);
  }
  if (process.env.NODE_ENV === 'production') {
    try {
      // Sending confirmation email
      const source = fs.readFileSync(
        'templates/confirmationEmail.html',
        'utf8'
      );
      template = handlebars.compile(source);
      const html = template({
        username: user.username,
        confirmationUrl: `${process.env.HOME_URL}/confirm/${confirmationToken.token}`,
        url: process.env.HOME_URL,
      });
      await sendEmail(user.email, 'Confirm your instaclone account', html);
    } catch (err) {
      console.log(err);
    }
  }
};
