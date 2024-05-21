const Item = require("../models/clothingItem");
const {
  NOT_FOUND_ERROR,
  BAD_REQUEST_ERROR,
  SERVER_ERROR,
} = require("../utils/errors");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  Item.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.status(200).send({ item }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST_ERROR).send({ message: err.message });
      }
      console.error(err);
      return res.status(SERVER_ERROR).send({ message: err.message });
    });
};

function deleteItem(req, res) {
  const { itemId } = req.params;
  Item.findByIdAndDelete(itemId)
    .orFail()
    .then(() => res.status(200).send({ message: "Item deleted" }))
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST_ERROR).send({ message: err.message });
      } if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND_ERROR).send({ message: err.message });
      }
      console.error(err);
      return res.status(SERVER_ERROR).send({ message: err.message });
    });
}

function getItems(req, res) {
  Item.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err.message);
      return res.status(SERVER_ERROR).send({ message: err.message });
    });
}

function likeItem(req, res) {
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
        return res.status(NOT_FOUND_ERROR).send({ message: err.message });
      } if (err.name === "CastError") {
        return res.status(BAD_REQUEST_ERROR).send({ message: err.message });
      }
      console.error(err);
      return res.status(SERVER_ERROR).send({ message: err.message });
    });
}
function dislikeItem(req, res) {
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
        return res.status(NOT_FOUND_ERROR).send({ message: err.message });
      } if (err.name === "CastError") {
        return res.status(BAD_REQUEST_ERROR).send({ message: err.message });
      }
      console.error(err);
      return res.status(SERVER_ERROR).send({ message: err.message });
    });
}

module.exports = {
  getItems,
  deleteItem,
  createItem,
  likeItem,
  dislikeItem,
};
