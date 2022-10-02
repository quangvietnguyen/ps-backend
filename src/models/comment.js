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

commentSchema.methods.generateToken = async function () {
  const comment = this;
  const token = jwt.sign(
    { _id: comment._id.toString() },
    process.env.JWT_SECRET
  );
  comment.token = token;
  await comment.save();
  return token;
};

commentSchema.statics.findByPost = async (post) => {
  const comments = await Comment.find({ post });
  if (!comments) {
    return;
  } else return comments;
};

commentSchema.statics.findById = async (id) => {
  const comment = await Comment.findOne({ _id: id });
  if (!comment) {
    return;
  } else return comment;
};

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
