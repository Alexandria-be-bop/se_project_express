const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");

const getCurrentUser = (req, res, next) => {
  const currentUser = req.user;
  User.findById(currentUser)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch(next);
};

const updateProfile = async (req, res, next) => {
  const { name, avatar } = req.body;
  const userId = req.user._id;
  try {
    User.findByIdAndUpdate(
      userId,
      { name, avatar },
      { new: true, runValidators: true }
    )
      .orFail()
      .then((user) => {
        // Return the updated user object
        res.status(200).json({
          _id: user._id,
          name: user.name,
          avatar: user.avatar,
        });
      });
  } catch (err) {
    next(err);
  }
};

const createUser = (req, res, next) => {
  const { name, avatar, email } = req.body;

  // Check the database to see if email exists aready
  User.findOne({ email })
    .then((user) => {
      // if user does exist, throw an error to trigger the catch block
      if (user) {
        const error = new Error("Email is already in use");
        throw error;
      }
      return bcrypt.hash(req.body.password, 10);
    })
    .then((encryptedPassword) =>
      User.create({
        name,
        avatar,
        email,
        password: encryptedPassword,
      })
    )
    .then((user) =>
      res
        .status(201)
        .send({ name: user.name, avatar: user.avatar, email: user.email })
    )
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const err = new Error("Email and password are required");
    return next(err);
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch(next);
};

module.exports = { getCurrentUser, updateProfile, createUser, login };
