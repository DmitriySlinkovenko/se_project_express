const Item = require("../models/clothingItem");

const BadRequestError = require("../errors/BadRequestError");
const NotFoundError = require("../errors/NotFoundError");
const UnauthorizedError = require("../errors/UnauthorizedError");

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  Item.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.status(200).send({ item }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid data."));
      }
      next(err);
    });
};

function deleteItem(req, res, next) {
  const { itemId } = req.params;
  const userId = req.user._id;
  Item.findById(itemId)
    .orFail()
    .then((item) => {
      if (!item) {
        next(new NotFoundError("Item not found."));
      }
      if (!item.owner.equals(userId)) {
        next(
          new UnauthorizedError("Cannot delete items owned by other customers.")
        );
      }
      return Item.deleteOne(item)
        .then(() => res.status(200).send({ message: "Item deleted" }))
        .catch((err) => {
          next(err);
        });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid Data."));
      }
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Item not found."));
      }
      next(err);
    });
}

function getItems(req, res, next) {
  Item.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      next(err);
    });
}

function likeItem(req, res, next) {
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => {
      res.status(201).send(item);
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Item not found."));
      }
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid Data."));
      }
      next(err);
    });
}
function dislikeItem(req, res, next) {
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => {
      res.status(200).send(item);
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Item not found."));
      }
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid Data."));
      }
      next(err);
    });
}

module.exports = {
  getItems,
  deleteItem,
  createItem,
  likeItem,
  dislikeItem,
};
