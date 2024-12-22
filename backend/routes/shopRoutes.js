const express = require("express");
const router = express.Router();
const {
  verifyTokenAndVendor,
  verifyToken,
} = require("../middleware/authMiddleware");
const shopController = require("../controllers/shopController");
const {
  upload,
  convertAndUploadToS3,
} = require("../middleware/fileUploadMiddleware");

// Shop category routes for admin
router.post(
  "/shop-category",
  upload.single("photo"),
  convertAndUploadToS3("shop-categories"),
  shopController.createShopCategory
);
router.get("/shop-category", shopController.getShopCategories);
router.get("/shop-list", shopController.getShopList);
router.delete("/shop-category/:id", shopController.deleteShopCategory);
router.put(
  "/shop-category/:id",
  upload.single("photo"),
  convertAndUploadToS3("shop-categories"),
  shopController.updateShopCategory
);

router.get("/local-by-coordinates", shopController.getLocalShopsByCoordinates);

router.post("/local", shopController.getLocalShops);

router.get("/:id", shopController.getShopById);

router.get("/:id/marketplace", shopController.getShopDetailsByIdForMarketplace);

module.exports = router;
