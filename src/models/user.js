const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
    },
    passcode: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value) {
        if (value.toLowerCase().includes('passcode')) {
          throw new Error('Passcode cannot contain "passcode"');
        }
      },
    },
  },
  {
    timpestamp: true,
  }
);

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.passcode;
  return userObject;
};

userSchema.statics.findByEmail = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    return;
  }
  return user;
};

userSchema.statics.findByCredentials = async (email, passcode) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('User does not exist');
  } else {
    const isMatch = await bcrypt.compare(passcode, user.passcode);
    if (!isMatch) {
      throw new Error('Passcode does not match');
    }
  }
  return user;
};

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('passcode')) {
    user.passcode = await bcrypt.hash(user.passcode, 8);
  }
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
