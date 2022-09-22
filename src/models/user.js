const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
      minlength: 7,
      validate(value) {
        if (value.toLowerCase().includes('password')) {
          throw new Error('Password cannot contain "password"');
        }
      },
    },
    // tokens: [
    //   {
    //     token: {
    //       type: String,
    //       required: true,
    //     },
    //   },
    // ],
  },
  {
    timpestamp: true,
  }
);

// userSchema.methods.generateAuthToken = async function () {
//   const user = this;
//   const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
//   user.tokens = user.tokens.concat({ token });
//   await user.save();
//   return token;
// };

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.passcode;
  // delete userObject.tokens;
  return userObject;
};

userSchema.statics.findByCredentials = async (email, passcode) => {
  const user = await User.findOne({ email });
  if (user) {
    throw new Error('User is already existed');
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
