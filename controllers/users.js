const User = require("../models/user");
const {
  NOT_FOUND_ERROR,
  BAD_REQUEST_ERROR,
  SERVER_ERROR,
  UNAUTHORIZED,
  DUPLICATE_ERROR,
} = require("../utils/errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");

const getUserById = (req, res) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND_ERROR).send({ message: "User not found" });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST_ERROR).send({ message: "Invalid data" });
      }
      console.error(err);
      return res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

function getUsers(req, res) {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.error(err);
      return res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
}

function createUser(req, res) {
  const { name, avatar, email, password } = req.body;

  if (!email) {
    return res
      .status(BAD_REQUEST_ERROR)
      .send({ message: "Enter a valid email." });
  }
  User.findOne({ email })
    .then((user) => {
      if (user) {
        return res
          .status(DUPLICATE_ERROR)
          .send({ message: "Email already exists" });
      }
      return bcrypt
        .hash(password, 10)
        .then((hash) => {
          return User.create({
            name,
            avatar,
            email,
            password: hash,
          });
        })
        .then((user) => {
          res.status(201).send({ name, avatar, email });
        })
        .catch((err) => {
          if (err.name === "ValidationError") {
            console.error(err.message);
            return res
              .status(BAD_REQUEST_ERROR)
              .send({ message: "Invalid data" });
          }
        });
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
}

function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(BAD_REQUEST_ERROR)
      .send({ message: "Please enter your email and password." });
  }
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(UNAUTHORIZED)
        .send({ message: "Invalid email or password" });
    });
}

function updateProfile(req, res) {
  const { name, avatar } = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND_ERROR).send({ message: "User not found" });
      }
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST_ERROR).send({ message: "Invalid Data" });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "Internal server error" });
    });
}

module.exports = {
  getUserById,
  getUsers,
  createUser,
  login,
  updateProfile,
};
