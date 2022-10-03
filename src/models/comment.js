const mongoose = require('mongoose');
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
    timestamp: true,
  }
);

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
