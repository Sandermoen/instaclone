const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: value => {
      if (!validator.isEmail(value)) {
        throw new Error('Invalid email address.');
      }
    }
  },
  username: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
    minlength: 3
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  avatar: String
});

userSchema.pre('save', function(next) {
  const saltRounds = 10;
  bcrypt.genSalt(saltRounds, (err, salt) => {
    if (err) return next(err);
    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) return next(err);
      this.password = hash;
      next();
    });
  });
});

userSchema.statics.findByCredentials = async function(
  usernameOrEmail,
  password
) {
  const user = await User.findOne({
    $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }]
  });

  if (!user) {
    throw new Error('Invalid login credentials');
  }

  const matchingPasswords = await bcrypt.compare(password, user.password);
  if (!matchingPasswords) {
    throw new Error('Invalid login credentials');
  }

  return user;
};

userSchema.statics.findByTokenId = async function(id) {
  try {
    const user = await User.findOne({
      _id: id
    });

    if (!user) {
      throw new Error('Invalid login credentials');
    }

    return user;
  } catch (err) {
    return next(err);
  }
};

const User = mongoose.model('User', userSchema);

module.exports = User;
