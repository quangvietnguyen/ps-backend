const express = require('express');
const User = require('../models/user');
const Comment = require('../models/comment');
const router = new express.Router();

router.get('/comments/:post', async (req, res) => {
  try {
    const comment = await Comment.find({ post: req.params.post });
    res.status(200).send(comment);
  } catch (e) {
    res.status(500).send(e);
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
  const user = new User(req.body);
  const usr = await User.findByEmail(req.body.email);
  if (!usr) {
    try {
      await user.save();
      res.status(201).send({ user });
    } catch (e) {
      res.status(400).send(e);
    }
  } else res.status(401).send('User is already existed');
});

router.put('/comment/update', async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.passcode
    );
    if (user) return res.status(200).send('User found');
  } catch (e) {
    res.status(400).send('User not found');
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
