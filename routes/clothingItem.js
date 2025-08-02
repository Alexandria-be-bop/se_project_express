const router = require("express").Router();

const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  disLikeItem,
} = require("../controllers/clothingItem");
const { tokenAuthorization } = require("../middlewares/authorization");
const { validateCardBody, validateId } = require("../middlewares/validation");

router.get("/", getItems);
router.use(tokenAuthorization);
router.post("/", validateCardBody, createItem);
router.delete("/:id", validateId, deleteItem);
router.put("/:id/likes", validateId, likeItem);
router.delete("/:id/likes", validateId, disLikeItem);

module.exports = router;
