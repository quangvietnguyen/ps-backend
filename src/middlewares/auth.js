const User = require('../models/user');
const HttpError = require('../models/http-error');

module.exports = async (req, res, next) => {
  if (!req.body) {
    return next();
  }
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.passcode
    );
    if (!user) {
      throw new Error('Authentication failed!');
    }
    next();
  } catch (err) {
    const error = new HttpError('Authentication failed!', 401);
    return next(error);
  }
};
