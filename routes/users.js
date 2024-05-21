const express = require("express");

const router = express.Router();

const { getUserById, createUser, getUsers } = require("../controllers/users");

router.get("/", getUsers);
router.get("/:userId", getUserById);
router.post("/", createUser);

module.exports = router;
