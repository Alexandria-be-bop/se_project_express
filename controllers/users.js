const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");

const getCurrentUser = (req, res, next) => {
  const { currentUser } = req.user;
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
      { name: name, avatar: avatar },
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
  } catch (next) {}
};

const createUser = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((encryptedPassword) => {
      const { name, avatar, email } = req.body;
      return User.create({ name, avatar, email, password: encryptedPassword });
    })
    .then((user) =>
      res
        .status(201)
        .send({ name: user.name, avatar: user.avatar, email: user.email })
    )
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch(next);
};

module.exports = { getCurrentUser, updateProfile, createUser, login };
