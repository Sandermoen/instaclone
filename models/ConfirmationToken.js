const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ConfirmationTokenSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User',
  },
  token: String,
});

const ConfirmationTokenModel = mongoose.model(
  'ConfirmationToken',
  ConfirmationTokenSchema
);

module.exports = ConfirmationTokenModel;
