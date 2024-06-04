const router = require("express").Router();
const userRouter = require("./users");
const itemsRouter = require("./clothingItems");
const { login, createUser } = require("../controllers/users");
const { auth } = require("../middlewares/auth");
const NotFoundError = require("../errors/NotFoundError");

router.use("/items", itemsRouter);
router.post("/signup", createUser);
router.post("/signin", login);
router.use(auth);
router.use("/users", userRouter);

router.use("*", (req, res, next) =>
  next(new NotFoundError("Route does not exist."))
);

module.exports = router;
