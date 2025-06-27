const router = require("express").Router();

const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  disLikeItem,
} = require("../controllers/clothingItem");
const { tokenAuthorization } = require("../middlewares/authorization");

router.get("/", getItems);
router.use(tokenAuthorization);
router.post("/", createItem);
router.delete("/:id", deleteItem); 
router.put("/:id/likes", likeItem);
router.delete("/:id/likes", disLikeItem);

module.exports = router;
