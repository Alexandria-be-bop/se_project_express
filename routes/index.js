const router = require("express").Router();
const userRouter = require("./users");
const clothingItems = require("./clothingItem");
const { NotFoundError } = require("../middlewares/errorHandler");
const { login, createUser } = require("../controllers/users");
const {
  validateUserLogin,
  validateCreatedUser,
} = require("../middlewares/validation");

router.use("/users", userRouter);
router.use("/items", clothingItems);
router.post("/signin", validateUserLogin, login);
router.post("/signup", validateCreatedUser, createUser);

router.use((req, res, next) => {
  next(new NotFoundError("Route not found"));
});

module.exports = router;
