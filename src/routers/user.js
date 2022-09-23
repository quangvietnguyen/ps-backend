const express = require('express');
const User = require('../models/user');
const router = new express.Router();

router.post('/user/create', async (req, res) => {
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

router.post('/user/check', async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.passcode
    );
    user && res.status(200).send({ user });
  } catch (e) {
    res.status(400).send(e);
  }
});

// router.post('/users/logoutAll', auth, async (req, res) => {
//   try {
//     req.user.tokens = [];
//     await req.user.save();
//     res.send();
//   } catch (e) {
//     res.status(500).send();
//   }
// });

module.exports = router;
