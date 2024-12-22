const express = require("express");
const router = express.Router();

const {
  verifyToken,
  verifyTokenAndRole,
} = require("../middleware/authMiddleware");

const teamMemberController = require("../controllers/teamMemberController");

// ================auth==================
router.post("/login", teamMemberController.loginTeamMember);

// ****************admin**************
router.post("/admin/register", teamMemberController.registerAdmin);

// ================member================
router.patch("/member", teamMemberController.updateTeamMember);
router.post(
  "/member",
  verifyTokenAndRole("admin"),
  teamMemberController.addTeamMemberByAdmin
);
router.get(
  "/member/all",
  verifyTokenAndRole("member, admin"),
  teamMemberController.getAllTeamMemberByAdmin
);
router.get(
  "/member/:id",
  verifyTokenAndRole("admin, member"),
  teamMemberController.getTeamMemberByAdmin
);
router.patch(
  "/member/:id",
  verifyTokenAndRole("admin"),
  teamMemberController.updateTeamMemberByAdmin
);
router.delete(
  "/member/:id",
  verifyTokenAndRole("admin"),
  teamMemberController.deleteTeamMemberByAdmin
);

// =================Shop=================
router.get(
  "/shop/all",
  verifyTokenAndRole("admin, member"),
  teamMemberController.getAllShops
);
router.get(
  "/shop/:id",
  verifyTokenAndRole("admin, member"),
  teamMemberController.getShopDetailsById
);
router.patch(
  "/shop/:id",
  verifyTokenAndRole("admin"),
  teamMemberController.updateShop
);
router.delete(
  "/shop/:id",
  verifyTokenAndRole("admin"),
  teamMemberController.deleteShopById
);
router.delete(
  "/shop/review/:id",
  verifyTokenAndRole("admin"),
  teamMemberController.deleteReviewOfShop
);

// ===============Location==============
router.get(
  "/locations/all",
  verifyTokenAndRole("admin, member"),
  teamMemberController.getAllLocations
);
router.get(
  "/locations/:id",
  verifyTokenAndRole("admin, member"),
  teamMemberController.getLocationDetails
);
router.patch(
  "/locations/:id",
  verifyTokenAndRole("admin"),
  teamMemberController.updateLocation
);

// ===============Item==============

router.get(
  "/items/all",
  verifyTokenAndRole("admin, member"),
  teamMemberController.getAllItems
);

// ===============Vendor==============

router.get(
  "/vendors/all",
  verifyTokenAndRole("admin, member"),
  teamMemberController.getAllVendors
);
router.get(
  "/vendors/:id",
  verifyTokenAndRole("admin, member"),
  teamMemberController.getVendorDetails
);
router.patch(
  "/vendors/:id",
  verifyTokenAndRole("admin"),
  teamMemberController.updateVendor
);
router.delete(
  "/vendors/:id",
  verifyTokenAndRole("admin"),
  teamMemberController.deleteVendor
);

module.exports = router;
