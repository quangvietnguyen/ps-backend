const HttpError = require('../models/http-error');
const validator = require('validator');

module.exports = async (req, res, next) => {
  if (!req.body) {
    return next();
  }
  try {
    if (req.method === 'POST' && !req.body.name) {
      throw new HttpError('There must be a name.', 401);
    }
    if (req.method !== 'GET') {
      if (!req.body.email) {
        throw new HttpError('There must be an email.', 401);
      }
      if (!req.body.passcode) {
        throw new HttpError('There must be a passcode.', 401);
      }
      if (!validator.isEmail(req.body.email)) {
        throw new HttpError('Email is not valid.', 401);
      }
    }
    next();
  } catch (err) {
    const error = new HttpError('Validation failed', 401);
    return next(error);
  }
};
