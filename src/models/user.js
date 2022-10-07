const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Schema } = mongoose;
const dotenv = require('dotenv');
dotenv.config();

const userSchema = new mongoose.Schema(
  {
    _id: Schema.Types.ObjectId,
    name: {
      type: String,
      required: true,
      trim: true,
    },
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
        if (value.toLowerCase().includes('passcode')) {
          throw new Error('Passcode cannot contain "passcode"');
        }
      },
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.passcode;
  return userObject;
};

userSchema.statics.findById = async (id) => {
  const user = await User.findOne({ id });
  if (!user) {
    return;
  }
  return user;
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
      return;
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
