const User = require("../models/user");

const getUser = (req, res) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.status(200).send({ user }))
    .catch((err) => console.error(err));
};

function getUsers(req, res, next) {
  const getUser = (req, res) => {
    User.findById(req.user._id)
      .orFail()
      .then((user) => res.status(200).send({ user }))
      .catch((err) => console.error(err));
  };
}

async function createUser(req, res) {
  const { name, avatar } = await req.body;
  try {
    user.create({ name, avatar });
  } catch (err) {
    console.error(err.message);
  }
  res.send("User created");
}
