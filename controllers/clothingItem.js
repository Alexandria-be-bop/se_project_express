const { NOT_FOUND } = require("../middlewares/constants");
const clothingItem = require("../models/clothingItem");

// Create
const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;

  clothingItem
    .create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      res.send({ data: item });
    })
    .catch(next);
};

// Fetch
const getItems = (req, res, next) => {
  clothingItem
    .find({})
    .then((items) => res.status(200).send(items))
    .catch(next);
};

// Delete
const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  ClothingItem.findById(itemId)
    .then((item) => {
      if (!item) {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }

      if (item.owner.toString() !== userId) {
        return res.status(403).send({ message: "Access forbidden" });
      }

      return ClothingItem.findByIdAndDelete(itemId);
    })
    .then((deletedItem) => {
      if (deletedItem) {
        res.send({ message: "Item deleted successfully" });
      }
    })
    .catch(next);
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
    .catch(next);
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
    .catch(next);
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  disLikeItem,
};
