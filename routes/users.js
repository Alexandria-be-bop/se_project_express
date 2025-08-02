const router = require("express").Router();
const { getCurrentUser, updateProfile } = require("../controllers/users");
const { tokenAuthorization } = require("../middlewares/authorization");
const { validateUpdatedProfile } = require("../middlewares/validation");

router.use(tokenAuthorization);
router.get("/me", getCurrentUser);

router.patch("/me", validateUpdatedProfile, updateProfile);

module.exports = router;
