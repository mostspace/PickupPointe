const express = require("express");
const router = express.Router();
const {
  verifyToken,
  verifyTokenAndShopper,
} = require("../middleware/authMiddleware");
const shopperController = require("../controllers/shopperController");
const reviewController = require("../controllers/reviewController");
const {
  upload,
  convertAndUploadToS3,
} = require("../middleware/fileUploadMiddleware");

// Shopper Routes
router.post("/login", shopperController.login);
router.post("/register", shopperController.register);
router.post("/verify", shopperController.verifyShopper);
router.post("/send-verification-code", shopperController.sendVerificationCode);
router.post("/verifyPhone", shopperController.verifyPhoneOfShopper);
router.post(
  "/send-phone-verification-code",
  shopperController.sendPhoneVerificationCode
);
router.post("/recover", shopperController.recoverShopper);
router.post("/send-recover-code", shopperController.sendRecoverCode);
router.post("/send-feedback", shopperController.sendFeedback);
router.post("/create-new-password", shopperController.createNewPassword);

router.patch("/update-profile", verifyToken, shopperController.updateProfile);
router.get("/get-setting", verifyToken, shopperController.getSetting);
router.put("/change-password", verifyToken, shopperController.changePassword);
router.patch(
  "/upload-avatar",
  verifyToken,
  upload.single("photo"),
  convertAndUploadToS3("avatars"),
  shopperController.uploadAvatar
);

// ShopperSetting Routes
router.put(
  "/set-notification-setting",
  verifyToken,
  shopperController.setNotificationSetting
);
router.get(
  "/get-notification-setting",
  verifyToken,
  shopperController.getNotificationSetting
);

// Shop routes
router.post(
  "/shop/:shopId/review",
  verifyTokenAndShopper,
  reviewController.postReviewByShopper
);

module.exports = router;
