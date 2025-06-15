const clothingItem = require("../models/clothingItem");

// Create
const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  clothingItem
    .create({ name, weather, imageUrl })
    .then((item) => {
      res.send({ data: item });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({ message: err.message });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};

// Fetch
const getItems = (req, res) => {
  clothingItem
    .find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

// // Update
// const updateItem = (req, res) => {
//   const { id } = req.params;
//   const { imageUrl } = req.body;

//   clothingItem.findByIdAndUpdate(
//     id,
//     { $set: { imageUrl } }.orFail().then(() => {
//       res.status(500).send({ message: err.message });
//     })
//   );
// };

// Delete
const deleteItem = (req, res) => {
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

// Like Item
const likeItem = (req, res) => {
  const { id } = req.params;
  clothingItem
    .findByIdAndUpdate(
      id,
      { $addToSet: { likes: id } },
      { new: true, runValidators: true }
    )
    .orFail()
    .then((updatedItem) =>
      res.status(200).json({ message: "Liked", data: updatedItem })
    )
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(404).json({ message: err.message });
      }
      if (err.name === "CastError") {
        return res.status(400).json({ message: err.message });
      }
      return res.status(500).json({ message: err.message });
    });
};

// RemoveLike Item
const disLikeItem = (req, res) => {
  const { id } = req.params;
  clothingItem
    .findByIdAndUpdate(
      id,
      { $pull: { likes: id } },
      { new: true, runValidators: true }
    )
    .orFail()
    .then((updatedItem) =>
      res.status(200).json({ message: "", data: updatedItem })
    )
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(404).json({ message: err.message });
      }
      if (err.name === "CastError") {
        return res.status(400).json({ message: err.message });
      }
      return res.status(500).json({ message: err.message });
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  disLikeItem,
};
