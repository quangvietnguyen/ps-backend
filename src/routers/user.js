const express = require('express');
const User = require('../models/user');
const router = new express.Router();
const auth = require('../middlewares/auth');

// router.post('/users', async (req, res) => {
//   const user = new User(req.body);
//   try {
//     await user.save();
//     const token = await user.generateAuthToken();
//     res.status(201).send({ user, token });
//   } catch (e) {
//     res.status(400).send(e);
//   }
// });

router.post('/users/create', async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.passcode
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send();
  }
});

router.post('/users/check', async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.passcode
    );
    const token = await user.generateAuthToken();
  } catch (e) {
    res.status(400).send();
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
