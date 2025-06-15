const router = require("express").Router();
const userRouter = require("./users");
const clothingItems = require("./clothingItem");

const NOT_FOUND = 404

router.use("/users", userRouter);
router.use("/items", clothingItems);

router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: err.message });
});

module.exports = router;
