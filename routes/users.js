const router = require("express").Router();
const { getCurrentUser, updateProfile } = require("../controllers/users");
const { tokenAuthorization } = require("../middlewares/authorization");

router.use(tokenAuthorization);
router.get("/me", getCurrentUser);
router.patch("/me", updateProfile);

module.exports = router;
