const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'name is required'],
  },
  email: {
    type: String,
    required: [true, 'email is required'],
  },
  password: {
    type: String,
    required: [true, 'password is required'],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  votedPolls: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'polls',
    },
  ],
});

const userModel = mongoose.model('users', userSchema);

module.exports = userModel;
