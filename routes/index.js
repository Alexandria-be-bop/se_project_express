const router = require("express").Router();
const userRouter = require("./users");
const clothingItems = require("./clothingItem");

router.use("/users", userRouter);
router.use("/items", clothingItems);

router.use((req, res) => {
  res.status(500).send({ message: err.message });
});

module.exports = router;
