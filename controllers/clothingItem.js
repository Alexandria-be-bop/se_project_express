const {
  FORBIDDEN,
  OK,
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
} = require("../middlewares/errorHandler");
const clothingItem = require("../models/clothingItem");

// Create
const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;

  clothingItem
    .create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      res.send(item);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid data"));
      } else {
        next(err);
      }
    });
};

// Fetch
const getItems = (req, res, next) => {
  clothingItem
    .find({})
    .then((items) => res.status(OK).send(items.reverse()))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Item not found"));
      } else {
        next(err);
      }
    });
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
        next(new ForbiddenError("User is not the owner"));
      }
      return item
        .deleteOne()
        .then(() => res.status(OK).send({ message: "Successfully Deleted" }))

        .catch(next);
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Item not found"));
      } else {
        next(err);
      }
    });
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
      res.status(OK).json({ message: "Liked", data: updatedItem })
    )
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Item not found"));
      } else if (err.name === "ValidationError") {
        next(new UnauthorizedError("Unauthorized"));
      } else {
        next(err);
      }
    });
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
      res.status(OK).json({ message: "", data: updatedItem })
    )
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Item not found"));
      } else if (err.name === "ValidationError") {
        next(new UnauthorizedError("Unauthorized"));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  disLikeItem,
};
