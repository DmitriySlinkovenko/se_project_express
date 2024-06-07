const express = require("express");

const router = express.Router();
const {
  createItem,
  deleteItem,
  getItems,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");
const { auth } = require("../middlewares/auth");
const { validateId, validateCardBody } = require("../middlewares/validation");

router.get("/", getItems);
router.use(auth);
router.post("/", validateCardBody, createItem);
router.put("/:itemId/likes", validateId, likeItem);
router.delete("/:itemId/likes", validateId, dislikeItem);
router.delete("/:itemId", validateId, deleteItem);

module.exports = router;
