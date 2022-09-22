const express = require('express');
const User = require('../models/user');
const router = new express.Router();

router.post('/users/create', async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.status(201).send({ user });
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
    user && res.status(200).send();
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
