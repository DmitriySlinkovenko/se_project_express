const router = require("express").Router();
const userRouter = require("./users");
const itemsRouter = require("./clothingItems");
const { login, createUser } = require("../controllers/users");
const { auth } = require("../middlewares/auth");
const { NOT_FOUND_ERROR } = require("../utils/errors");

router.use("/items", itemsRouter);
router.post("/signup", createUser);
router.post("/signin", login);
router.use(auth);
router.use("/users", userRouter);

router.use("*", (req, res) => res.status(NOT_FOUND_ERROR).send({ message: "Route does not exist" }));

module.exports = router;
