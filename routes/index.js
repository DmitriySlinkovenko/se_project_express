const router = require("express").Router();
const userRouter = require("./users");
const itemsRouter = require("./clothingItems");
const { login, createUser } = require("../controllers/users");
const { auth } = require("../middlewares/auth");

router.use("/items", itemsRouter);
router.post("/signup", createUser);
router.post("/signin", login);
router.use(auth);
router.use("/users", userRouter);

module.exports = router;
