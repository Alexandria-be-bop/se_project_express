const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const { default: isEmail } = require("validator/lib/isEmail");

// New user Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 2, maxlength: 30 },
  avatar: {
    type: String,
    required: [true, "The avatar field is required."],
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL",
    },
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (v) => isEmail(v),
      message: "Wrong email format",
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

// Password authorization
userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password
) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        const error = new Error("Unauthorized");
        return Promise.reject(error);
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          const error = new Error("Unauthorized");
          return Promise.reject(error);
        }
        return user;
      });
    });
};

module.exports = mongoose.model("user", userSchema);
