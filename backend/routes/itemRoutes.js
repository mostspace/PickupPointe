const express = require("express");
const router = express.Router();

const {
  verifyToken,
  verifyTokenAndVendor,
} = require("../middleware/authMiddleware");
const {
  upload,
  convertAndUploadToS3,
} = require("../middleware/fileUploadMiddleware");
const itemController = require("../controllers/itemController");

// Metrics
router.post("/metrics", itemController.addMetric);
router.get("/metrics", itemController.getAllMetrics);
router.delete("/metrics/:id", itemController.deleteMetricById);
router.put("/metrics/:id", itemController.updateMetricById);

// Variants
router.post("/variants", verifyTokenAndVendor, itemController.addVariant);
router.get("/variants", verifyTokenAndVendor, itemController.getAllVariants);
router.delete(
  "/variants/:id",
  verifyTokenAndVendor,
  itemController.deleteVariant
);
router.put("/variants/:id", verifyTokenAndVendor, itemController.updateVariant);

// Shop
router.get("/shop/:id", itemController.getItemsByShopId);

// Item Routes
router.post(
  "",
  verifyToken,
  upload.single("photo"),
  convertAndUploadToS3("items"),
  itemController.addItem
);
router.post("/all", verifyToken, itemController.getAll);
router.get("/:id", verifyToken, itemController.getItemById);
router.put(
  "/:id",
  verifyToken,
  upload.single("photo"),
  convertAndUploadToS3("items"),
  itemController.updateItem
);
router.delete("/:id", verifyToken, itemController.deleteItem);

module.exports = router;
