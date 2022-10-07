const mongoose = require('mongoose');
const User = require('../models/user');
const Comment = require('../models/comment');

const getComments = async (req, res, next) => {
  try {
    const comments = await Comment.findByPost(req.params.post);
    if (comments) {
      res.status(200).send(comments);
    } else res.status(404).send('No comment found.');
  } catch (e) {
    res.status(401).send(e);
  }
};

const getComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (comment) {
      res.status(200).send(comment);
    } else res.status(404).send('No comment found.');
  } catch (e) {
    res.status(401).send(e);
  }
};

const createComment = async (req, res, next) => {
  try {
    const usr = await User.findByEmail(req.body.email);
    if (!usr) {
      const user = new User({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        email: req.body.email,
        passcode: req.body.passcode,
      });
      user.save(function (err) {
        if (err) return res.status(401).send(err);
        const comment = new Comment({
          _id: new mongoose.Types.ObjectId(),
          user: user._id,
          post: req.body.post,
          comment: req.body.comment,
        });
        comment.save(function (err) {
          if (err) return res.send(401).send(err);
          res.status(201).send('User and comment created.');
        });
      });
    } else {
      const credential = await User.findByCredentials(
        req.body.email,
        req.body.passcode
      );
      if (credential) {
        const comment = new Comment({
          _id: new mongoose.Types.ObjectId(),
          user: credential._id,
          post: req.body.post,
          comment: req.body.comment,
        });
        comment.save(function (err) {
          if (err) return res.status(401).send(err);
          res.status(201).send('User matched and comment created.');
        });
      } else res.status(401).send('Unauthorized user.');
    }
  } catch (e) {
    res.status(400).send(e);
  }
};

const updateComment = async (req, res, next) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.passcode
    );
    if (user) {
      const comment = await Comment.findById(req.params.id);
      if (comment && comment.user.equals(user._id)) {
        comment.comment = req.body.comment;
        if (req.body.name) user.name = req.body.name;
        comment.save(function (err) {
          if (err) return res.status(401).send(err);
          user.save(function (err) {
            if (err) return res.status(401).send(err);
            res.status(200).send('Comment updated.');
          });
        });
      } else {
        res.status(404).send('Comment not found.');
      }
    } else res.status(404).send('User not found.');
  } catch (e) {
    res.status(400).send(e);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.passcode
    );
    if (user) {
      const comment = await Comment.findById(req.params.id);
      if (comment && comment.user.equals(user._id)) {
        comment.remove(function (err) {
          if (err) return res.status(401).send(err);
          res.status(200).send('Comment deleted.');
        });
      } else {
        res.status(404).send('Comment not found.');
      }
    } else res.status(404).send('User not found.');
  } catch (e) {
    res.status(400).send(e);
  }
};

exports.getComments = getComments;
exports.getComment = getComment;
exports.createComment = createComment;
exports.updateComment = updateComment;
exports.deleteComment = deleteComment;
