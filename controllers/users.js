const User = require("../models/user");

//  GET users
const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.status(200);
      res.send(users);
    })
    .catch((err) => next(err));
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => next(err));
};

const createUser = (req, res, next) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      next(err);
    });
};

module.exports = { getUsers, getUserById, createUser };
