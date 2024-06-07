const express = require("express");

const router = express.Router();

const { getUserById, updateProfile } = require("../controllers/users");
const { validateUserUpdate } = require("../middlewares/validation");

router.get("/me", getUserById);
router.patch("/me", validateUserUpdate, updateProfile);
module.exports = router;
