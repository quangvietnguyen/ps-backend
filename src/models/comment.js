const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { Schema } = mongoose;

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    post: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 1000,
    },
  },
  {
    timpestamp: true,
  }
);

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
