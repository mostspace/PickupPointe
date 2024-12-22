const express = require("express");
const router = express.Router();

const {
  verifyToken,
  verifyTokenAndVendor,
} = require("../middleware/authMiddleware");
const vendorController = require("../controllers/vendorController");
const discountController = require("../controllers/discountController");
const tabletUserController = require("../controllers/tabletUserController");
const shopController = require("../controllers/shopController");
const {
  upload,
  convertAndUploadToS3,
} = require("../middleware/fileUploadMiddleware");

// Vendor routes
router.post("/quick-register", vendorController.quickRegister);
router.post("/register", vendorController.register);
router.post("/login", vendorController.login);

router.post("/verify", vendorController.verifyVendor);
router.post("/send-verification-code", vendorController.sendVerificationCode);

router.post("/recover", vendorController.recoverVendor);
router.post("/send-recover-code", vendorController.sendRecoverCode);
router.post("/send-feedback", vendorController.sendFeedback);
router.post("/create-new-password", vendorController.createNewPassword);

router.patch("/update-profile", verifyToken, vendorController.updateProfile);
router.put("/change-password", verifyToken, vendorController.changePassword);
router.patch(
  "/upload-avatar",
  verifyToken,
  upload.single("photo"),
  convertAndUploadToS3("avatars"),
  vendorController.uploadAvatar
);

// Vendor setting routes
router.put(
  "/update-fee-structure",
  verifyToken,
  vendorController.updateFeeStructure
);
router.get(
  "/get-global-settings",
  verifyToken,
  vendorController.getGlobalSettings
);
router.put("/set-tax-rate", verifyToken, vendorController.setTaxRate);
router.put(
  "/set-notification-settings",
  verifyToken,
  vendorController.setNotificationSetting
);
router.put("/set-delivery-fees", verifyToken, vendorController.setDeliveryFees);

// Discount routes
// router.post("/add-discounts", verifyToken, discountController.saveDiscount);
// router.put("/update-discount", verifyToken, discountController.updateDiscount);
//   "/disable-discount",
//   verifyToken,
// router.put(
//   discountController.disableDiscount
// );
router.get("/get-discounts", verifyToken, discountController.getDiscounts);
router.put(
  "/change-discount-status/:id",
  verifyToken,
  discountController.changeDiscountStatus
);
router.post(
  "/update-discounts",
  verifyToken,
  discountController.updateDiscounts
);

// Tablet user
router.post("/tablet-user", verifyToken, tabletUserController.addTabletUser);
router.post(
  "/tablet-user/all",
  verifyToken,
  tabletUserController.getAllTabletUsers
);
router.get("/tablet-user/:id", verifyToken, tabletUserController.getTabletUser);
router.delete(
  "/tablet-user/:id",
  verifyToken,
  tabletUserController.deleteTabletUser
);
router.patch(
  "/tablet-user/:id",
  verifyToken,
  tabletUserController.updateTabletUser
);
router.patch(
  "/tablet-user/:id/change-password",
  verifyTokenAndVendor,
  tabletUserController.changePassword
);
router.patch(
  "/tablet-user/:id/reset-password",
  verifyTokenAndVendor,
  tabletUserController.resetPassword
);

// Shop routes
router.post(
  "/shop",
  verifyTokenAndVendor,
  upload.array("photos"),
  convertAndUploadToS3("shops"),
  shopController.createShop
);
router.patch(
  "/shop/:id",
  verifyTokenAndVendor,
  upload.single("photo"),
  convertAndUploadToS3("shops"),
  shopController.updateShop
);
router.delete("/shop/:id", verifyTokenAndVendor, shopController.deleteShop);
router.get(
  "/shop/all",
  verifyTokenAndVendor,
  shopController.getAllShopsByVendorId
);

module.exports = router;
