const express = require("express");

const router = express.Router();

const { getUserById, updateProfile } = require("../controllers/users");

router.get("/me", getUserById);
router.patch("/me", updateProfile);
module.exports = router;
