const express = require("express");
const router = express.Router();
const user = require("../models/user");
const { getUser, createUser } = require("../controllers/users");

router.get("/", getUser);
