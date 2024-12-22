const express = require("express");
const router = express.Router();

const {
  verifyToken,
  verifyTokenAndVendor,
} = require("../middleware/authMiddleware");
const modifierController = require("../controllers/modifierController");
const modifierCategoryController = require("../controllers/modifierCategoryController");
const {
  upload,
  convertAndUploadToS3,
} = require("../middleware/fileUploadMiddleware");

// Modifier routes
router.post(
  "/add-modifier",
  verifyToken,
  upload.array("photos"),
  convertAndUploadToS3("modifier-items"),
  modifierController.addModifier
);
router.get("/get-modifiers", verifyToken, modifierController.getModifiers);
router.delete(
  "/remove-modifier",
  verifyToken,
  modifierController.deleteModifier
);
router.put(
  "/update-modifier",
  verifyToken,
  upload.array("photos"),
  convertAndUploadToS3("modifier-items"),
  modifierController.updateModifier
);

// Modifier category routes
router.post(
  "/category",
  verifyTokenAndVendor,
  modifierCategoryController.addModifierCategory
);
router.post(
  "/set-in-stock",
  verifyTokenAndVendor,
  modifierCategoryController.updateModifierInStock
);
router.get(
  "/category",
  verifyTokenAndVendor,
  modifierCategoryController.getAllModifierCategories
);
router.delete(
  "/category/:id",
  verifyTokenAndVendor,
  modifierCategoryController.deleteModifierCategory
);
router.put(
  "/category/:id",
  verifyTokenAndVendor,
  modifierCategoryController.updateModifierCategory
);
module.exports = router;
