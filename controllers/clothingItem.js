const { FORBIDDEN } = require("../middlewares/errorHandler");
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
  const itemId = req.params.id;
  const userId = req.user._id;

  clothingItem
    .findById(itemId)
    .orFail()
    .then((item) => {
      if (String(item.owner) !== userId) {
        return res
          .status(FORBIDDEN)
          .send({ message: "Only the owner can delete" });
      }
      return item
        .deleteOne()
        .then(() => res.status(200).send({ message: "Successfully Deleted" }))

        .catch(next);
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
