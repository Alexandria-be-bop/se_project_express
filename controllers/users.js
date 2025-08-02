const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const {
  NotFoundError,
  BadRequestError,
  ConflictError,
  UnauthorizedError,
  OK,
  CREATED,
  DUPLICATE_KEY,
} = require("../middlewares/errorHandler");

const getCurrentUser = (req, res, next) => {
  const currentUser = req.user;
  User.findById(currentUser)
    .orFail()
    .then((user) => res.status(OK).send(user))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("User not found"));
      } else {
        next(err);
      }
    });
};

const updateProfile = async (req, res, next) => {
  const { name, avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => {
      // Return the updated user object
      res.status(OK).json({
        _id: user._id,
        name: user.name,
        avatar: user.avatar,
      });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid data"));
      } else if (err.code === DUPLICATE_KEY) {
        next(new ConflictError("Duplicate email error"));
      } else if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("User not found"));
      } else {
        next(err);
      }
    });
};

const createUser = (req, res, next) => {
  const { name, avatar, email } = req.body;

  // Check the database to see if email exists aready
  User.findOne({ email })
    .then((user) => {
      // if user does exist, throw an error to trigger the catch block
      if (user) {
        next(new ConflictError("Duplicate email error"));
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
        .status(CREATED)
        .send({ name: user.name, avatar: user.avatar, email: user.email })
    )
    .catch((err) => {
      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    next(new BadRequestError("No email or Password"));
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      if (err.message === "Unauthorized") {
        next(new UnauthorizedError("Incorrect credentials"));
      } else {
        next(err);
      }
    });
};

module.exports = { getCurrentUser, updateProfile, createUser, login };
