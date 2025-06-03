const User = require("../models/user");

//GET /users
const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(200);
      res.send(users);
    })
    .catch((err) => {
      console.error(err);
      return res.status(err.statusCode).send({ message: err.message });
    });
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((User) => res.status(200).send(User))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        res.status(404).send({ message: err.message });
      } else if (err.name === "CastError") {
        res.status(400).send({ message: err.message });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((User) => res.status(201).send(User))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports = { getUsers, getUserById, createUser };
