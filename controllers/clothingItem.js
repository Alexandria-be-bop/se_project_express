const clothingItem = require("../models/clothingItem");

// Create
const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;

  clothingItem
    .create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      res.send({ data: item });
    })
    .catch((err) => next(err));
};

// Fetch
const getItems = (req, res, next) => {
  clothingItem
    .find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => next(err));
};

// Delete
const deleteItem = (req, res, next) => {
  const { id } = req.params;

  clothingItem
    .findByIdAndDelete(id)
    .orFail()
    .then((item) => {
      res.status(200).json({
        message: "Item deleted",
        data: item,
      });
    })
    .catch((err) => next(err));
};

// Like Item
const likeItem = (req, res, next) => {
  const { id } = req.params;
  clothingItem
    .findByIdAndUpdate(
      id,
      { $addToSet: { likes: req.user._id } },
      { new: true, runValidators: true }
    )
    .orFail()
    .then((updatedItem) =>
      res.status(200).json({ message: "Liked", data: updatedItem })
    )
    .catch((err) => next(err));
};

// RemoveLike Item
const disLikeItem = (req, res, next) => {
  const { id } = req.params;
  clothingItem
    .findByIdAndUpdate(
      id,
      { $pull: { likes: req.user._id } },
      { new: true, runValidators: true }
    )
    .orFail()
    .then((updatedItem) =>
      res.status(200).json({ message: "", data: updatedItem })
    )
    .catch((err) => next(err));
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  disLikeItem,
};
