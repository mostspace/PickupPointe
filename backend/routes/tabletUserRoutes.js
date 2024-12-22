const express = require("express");
const router = express.Router();
const { verifyTokenAndTabletUser } = require("../middleware/authMiddleware");
const tabletUserController = require("../controllers/tabletUserController");

router.post("/login", tabletUserController.login);
router.get(
  "/setting",
  verifyTokenAndTabletUser,
  tabletUserController.getTabletUserSetting
);
router.patch(
  "/setting",
  verifyTokenAndTabletUser,
  tabletUserController.updateTabletUserSetting
);
router.post(
  "/feedback",
  verifyTokenAndTabletUser,
  tabletUserController.submitFeedback
);

module.exports = router;
