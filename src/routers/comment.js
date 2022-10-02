const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/user');
const Comment = require('../models/comment');
const router = new express.Router();

router.get('/comments/:post', async (req, res) => {
  try {
    console.log(req.params.post);
    const comment = await Comment.findByPost(req.params.post);
    if (comment) {
      res.status(200).send(comment);
    } else res.status(404).send('No comment found!');
  } catch (e) {
    res.status(401).send(e);
  }
});

router.get('/comment/:token', async (req, res) => {
  try {
    const comment = await Comment.find({ token: req.params.token });
    res.status(200).send(comment);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.post('/comment/create', async (req, res) => {
  const user = new User({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    email: req.body.email,
    passcode: req.body.passcode,
  });
  const usr = await User.findByEmail(req.body.email);
  if (!usr) {
    try {
      user.save(function (err, user) {
        if (err) return res.status(401).send(err);
        const comment = new Comment({
          user: user._id,
          post: req.body.post,
          comment: req.body.comment,
        });
        comment.save(function (err, comment) {
          if (err) return res.status(401).send(err);
        });
      });
      res.status(201).send('User and comment created!');
    } catch (e) {
      res.status(400).send(e);
    }
  } else {
    try {
      const credential = await User.findByCredentials(
        usr.email,
        req.body.passcode
      );
      if (credential) {
        const comment = new Comment({
          user: credential._id,
          post: req.body.post,
          comment: req.body.comment,
        });
        await comment.save();
        res.status(201).send('User matched and comment created!');
      } else res.status(404).send('User did not match!');
    } catch (e) {
      res.status(400).send(e);
    }
  }
});

router.put('/comment/update', async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.passcode
    );
    if (user) return res.status(200).send('User found');
  } catch (e) {
    res.status(404).send('User not found');
  }
});

router.post('/comment/delete', async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.passcode
    );
    if (user) {
      await user.remove();
      res.status(200).send('User deleted');
    }
  } catch (e) {
    res.status(400).send('User not found');
  }
});

module.exports = router;
