const mongoose = require('mongoose');

const pollingSchema = new mongoose.Schema({
  Question: {
    type: String,
    required: [true, 'Question is required'],
  },
  options: [
    {
      text: {
        type: String,
        required: [true,'Option text is required'],
      },
      votes: {
        type: Number,
        default: 0,
      },
    },
  ],
});

const pollingModel = mongoose.model('polls', pollingSchema);
module.exports = pollingModel;


