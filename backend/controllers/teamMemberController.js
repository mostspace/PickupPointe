const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/jwt");
const { isEmailValid } = require("../utils/validators");

// Models
const Shop = require("../models/Shop");
const Location = require("../models/Location");
const TeamMember = require("../models/TeamMember");
const Review = require("../models/Review");
const Item = require("../models/Item");
const Vendor = require("../models/Vendor");

// =============== only for member =============
exports.updateTeamMember = async (req, res) => {
  const memberId = req.userId;
  const { email, password } = req.body;

  const existEmail = await TeamMember.findOne({ email });
  if (existEmail) {
    return res
      .status(400)
      .json({ message: "Someone is already using this email." });
  }
  try {
    const updateQuery = {};

    if (email && !isEmailValid(email)) {
      return res.status(400).json({ message: "Email is not valid" });
    }
    updateQuery.email = email;

    if (password) {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateQuery.password = hashedPassword;
    }

    // Check if team member already exists
    const existingMember = await TeamMember.findByIdAndUpdate(
      memberId,
      updateQuery,
      { new: true }
    ).select("-password");
    if (!existingMember) {
      return res.status(400).json({ message: "Not exist member." });
    }

    return res.status(201).json({
      message: "Team member updated successfully",
      teamMember: existingMember,
    });
  } catch (error) {
    console.log("updateTeamMember error=>", error);
    return res.status(500).json({ message: error.message });
  }
};

// =============== admin ==================
exports.registerAdmin = async (req, res) => {
  const { email, password, adminPassword, firstName, lastName } = req.body;
  if (adminPassword != process.env.ADMIN_PASSWORD) {
    return res
      .status(500)
      .json({ message: "You are not allowed to register admin." });
  }

  try {
    // Validate request
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!isEmailValid(email)) {
      return res.status(400).json({ message: "Email is not valid" });
    }

    // Check if team member already exists
    const existingMember = await TeamMember.findOne({ email });
    if (existingMember) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new team member
    const teamMember = await TeamMember.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: "admin", // Default to member if role not specified
    });

    // Generate JWT token
    const token = generateToken(teamMember);

    // Return success without password
    const { password: _, ...memberData } = teamMember.toObject();

    return res.status(201).json({
      message: "Team member registered successfully",
      teamMember: memberData,
      token,
    });
  } catch (error) {
    console.log("registerTeamMember error=>", error);
    return res.status(500).json({ message: error.message });
  }
};

// Register a new team member
exports.addTeamMemberByAdmin = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  try {
    // Validate request
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!isEmailValid(email)) {
      return res.status(400).json({ message: "Email is not valid" });
    }

    // Check if team member already exists
    const existingMember = await TeamMember.findOne({ email });
    if (existingMember) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new team member
    const teamMember = await TeamMember.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: "member", // Default to member if role not specified
    });

    // Return success without password
    const { password: _, ...memberData } = teamMember.toObject();

    return res.status(201).json({
      message: "Team member registered successfully",
      teamMember: memberData,
    });
  } catch (error) {
    console.log("registerTeamMember error=>", error);
    return res.status(500).json({ message: error.message });
  }
};

exports.getAllTeamMemberByAdmin = async (req, res) => {
  try {
    const teamMembers = await TeamMember.find({ role: "member" }).select(
      "-password"
    );
    return res.status(200).json({ members: teamMembers });
  } catch (error) {
    console.log("getAllTeamMemberByAdmin error=>", error);
    return res.status(500).json({ message: error.message });
  }
};

// Login team member
exports.loginTeamMember = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate request
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Find team member
    const teamMember = await TeamMember.findOne({ email });
    if (!teamMember) {
      return res.status(404).json({ message: "You are not registered." });
    }

    // Check if account is suspended
    if (teamMember.status !== "active") {
      return res.status(403).json({
        message: "Sorry, You are not allowed to sign in our platform.",
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, teamMember.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // Generate JWT token
    const token = generateToken(teamMember);

    // Return success without password
    const { password: _, ...memberData } = teamMember.toObject();
    return res.status(200).json({
      message: "Login successful",
      teamMember: memberData,
      token,
    });
  } catch (error) {
    console.log("loginTeamMember error=>", error);
    return res.status(500).json({ message: error.message });
  }
};

// Get team member profile
exports.getTeamMemberByAdmin = async (req, res) => {
  const memberId = req.params.id;
  if (!memberId) return res.status(400).json({ message: "Invalid request." });

  try {
    const teamMember = await TeamMember.findById(memberId).select("-password");
    if (!teamMember) {
      return res.status(404).json({ message: "Team member not found" });
    }
    return res.status(200).json({ teamMember });
  } catch (error) {
    console.log("getTeamMember error=>", error);
    return res.status(500).json({ message: error.message });
  }
};

exports.updateTeamMemberByAdmin = async (req, res) => {
  const memberId = req.params.id;
  const { email, password, status } = req.body;

  try {
    const updateQuery = { status, email };

    if (email && !isEmailValid(email)) {
      return res.status(400).json({ message: "Email is not valid" });
    }

    // Hash password
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateQuery.password = hashedPassword;
    }

    // Check if team member already exists
    const existingMember = await TeamMember.findByIdAndUpdate(
      memberId,
      updateQuery,
      { new: true, runValidators: true }
    ).select("-password");
    if (!existingMember) {
      return res.status(400).json({ message: "Not exist member." });
    }

    return res.status(201).json({
      message: "Team member updated successfully",
      teamMember: existingMember,
    });
  } catch (error) {
    console.log("updateTeamMember error=>", error);
    return res.status(500).json({ message: error.message });
  }
};

exports.deleteTeamMemberByAdmin = async (req, res) => {
  const memberId = req.params.id;

  try {
    // Check if team member already exists
    const existingMember = await TeamMember.findByIdAndDelete(memberId, {
      new: true,
    });

    if (!existingMember) {
      return res.status(400).json({ message: "Not exist member." });
    }

    return res.status(201).json({
      message: "Team member deleted successfully",
    });
  } catch (error) {
    console.log("deleteTeamMemberByAdmin error=>", error);
    return res.status(500).json({ message: error.message });
  }
};

// =================Shop=================
exports.getAllShops = async (req, res) => {
  const shopId = req.query?.shopId || "shop";
  const isLive = req.query?.isLive;
  const pageSize = req.query?.pageSize || 10;
  const page = req.query?.page || 1;
  const offset = (page - 1) * pageSize;

  try {
    const findQuery = { shopId: { $regex: shopId, $options: "i" } };

    if (isLive === "true") findQuery.isLive = true;
    else if (isLive === "false") findQuery.isLive = false;

    const allShops = await Shop.find(findQuery)
      .populate({ path: "vendorId", select: "-password" })
      .skip(offset)
      .limit(pageSize);

    const totalResults = await Shop.countDocuments(findQuery);
    return res.status(200).json({ totalResults, shops: allShops });
  } catch (error) {
    console.log("getAllShops error=>", error);
    return res.status(500).json({ message: error.message });
  }
};

exports.getShopDetailsById = async (req, res) => {
  const shopId = req.params.id;

  try {
    const shop = await Shop.findById(shopId)
      .populate({ path: "locations" })
      .populate({ path: "categories" });
    if (!shop) {
      return res.status(400).json({ message: "Not exist shop." });
    }

    const reviews = await Review.find({ shopId: shop._id });

    return res
      .status(200)
      .json({ shop: { ...shop.toObject(), reviews }, message: "Success." });
  } catch (error) {
    console.log("getShopById error=>", error);
    return res.status(500).json({ message: error.message });
  }
};

exports.updateShop = async (req, res) => {
  const shopId = req.params.id;
  const isLive = req.body.isLive;
  const isActive = req.body.isActive;
  const savePercent = req.body.savePercent;

  try {
    const updateQuery = { savePercent };
    if (typeof isLive !== "undefined") {
      if (isLive === false) {
        updateQuery.isActive = false;
      }
      updateQuery.isLive = isLive;
    }

    if (typeof isActive !== "undefined") {
      updateQuery.isActive = isActive;
    }

    const shop = await Shop.findByIdAndUpdate(shopId, updateQuery, {
      new: true,
    })
      .populate({ path: "locations", select: "isLive" })
      .populate({ path: "vendorId", select: "-password" });

    if (!shop) {
      return res.status(500).json({ message: "Not exist shop." });
    }

    if (typeof isLive === "boolean") {
      shop.locations?.map((location, index) => {
        location.isLive = isLive;
        location.save();
      });
    }

    return res.status(200).json({ message: "Success.", shop });
  } catch (error) {
    console.log("setLiveStatusShopByAdmin error=>", error);
    return res.status(500).json({ message: error.message });
  }
};

exports.deleteShopById = async (req, res) => {
  const shopId = req.params.id;

  try {
    const shop = await Shop.findByIdAndDelete(shopId);
    if (!shop) {
      return res.status(400).json({ message: "Not exist shop." });
    }

    return res.status(200).json({ message: "Deleted successfully." });
  } catch (error) {
    console.log("deleteShopById error=>", error);
    return res.status(500).json({ message: error.message });
  }
};

exports.deleteReviewOfShop = async (req, res) => {
  const reviewId = req.params.id;

  try {
    const review = await Review.findByIdAndDelete(reviewId);
    if (!review) return res.status(400).json({ message: "Not exist review" });

    return res.status(200).json({ message: "Success" });
  } catch (error) {
    console.log("deleteReviewOfShop error=>", error);
    return res.status(500).json({ message: error.message });
  }
};

// ========================locations====================
exports.getAllLocations = async (req, res) => {
  const pageSize = req.query?.pageSize || 10;
  const page = req.query?.page || 1;
  const offset = (page - 1) * pageSize;

  try {
    const findQuery = {};
    const locations = await Location.find(findQuery)
      .skip(offset)
      .limit(pageSize);

    const totalResults = await Location.countDocuments(findQuery);

    return res
      .status(200)
      .json({ message: "Success", totalResults, locations });
  } catch (error) {
    console.log("getAllLocations error=>", error);
    return res.status(500).json({ message: error.message });
  }
};

exports.getLocationDetails = async (req, res) => {
  const locationId = req.params.id;

  try {
    const location = await Location.findById(locationId).populate({
      path: "vendorId",
      select: "-password",
    });
    if (!location) {
      return res.status(400).json({ message: "Not exist location." });
    }

    return res.status(200).json({ message: "Success.", location });
  } catch (error) {
    console.log("getLocationDetails error=>", error);
    return res
      .status(500)
      .json({ message: "Failed to get details of Locations" });
  }
};

exports.updateLocation = async (req, res) => {
  const { isLive } = req.body;
  const locationId = req.params.id;

  if (!locationId) return res.status(400).json({ message: "Bad request." });

  try {
    const updateQuery = { isLive };

    const location = await Location.findByIdAndUpdate(locationId, updateQuery, {
      new: true,
    });
    if (!location)
      return res.status(400).json({ message: "Not exisit location." });

    return res.status(200).json({ message: "success", location });
  } catch (error) {
    console.log("updateLocation error=>", error);
    return res.status(500).json({ message: "Failed to update location." });
  }
};

// ========================Item====================

exports.getAllItems = async (req, res) => {
  const pageSize = req.query?.pageSize || 10;
  const page = req.query?.page || 1;
  const offset = (page - 1) * pageSize;

  try {
    const findQuery = {};

    const items = await Item.find(findQuery).skip(offset).limit(pageSize);

    const totalResults = await Item.countDocuments(findQuery);

    return res.status(200).json({ message: "Success", totalResults, items });
  } catch (error) {
    console.log("getAllItems error=>", error);
    return res.status(500).json({ message: error.message });
  }
};

// ========================Vendor====================

exports.getAllVendors = async (req, res) => {
  const pageSize = req.query?.pageSize || 10;
  const page = req.query?.page || 1;
  const offset = (page - 1) * pageSize;
  const status = req.query?.status || "all";

  try {
    const findQuery = {};
    if (status !== "all") findQuery.status = status;

    const vendors = await Vendor.find(findQuery).skip(offset).limit(pageSize);

    const totalResults = await Vendor.countDocuments(findQuery);

    return res.status(200).json({ message: "Success", totalResults, vendors });
  } catch (error) {
    console.log("getAllVendors error=>", error);
    return res.status(500).json({ message: error.message });
  }
};

exports.getVendorDetails = async (req, res) => {
  const vendorId = req.params.id;

  try {
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(400).json({ message: "Not exist vendor." });
    }

    return res.status(200).json({ message: "Success.", vendor });
  } catch (error) {
    console.log("getVendorDetails error=>", error);
    return res.status(500).json({ message: error.message });
  }
};

exports.updateVendor = async (req, res) => {
  const vendorId = req.params.id;
  const { status } = req.body;

  try {
    const updateQuery = { status };

    const vendor = await Vendor.findByIdAndUpdate(vendorId, updateQuery, {
      new: true,
      runValidators: true,
    });

    if (!vendor) {
      return res.status(500).json({ message: "Not exist vendor." });
    }

    return res.status(200).json({ message: "Success.", vendor });
  } catch (error) {
    console.log("updateVendor error=>", error);
    return res.status(500).json({ message: error.message });
  }
};

exports.deleteVendor = async (req, res) => {
  const vendorId = req.params.id;

  try {
    const vendor = await Vendor.findByIdAndDelete(vendorId);
    if (!vendor) {
      return res.status(400).json({ message: "Not exist vendor." });
    }

    return res.status(200).json({ message: "Deleted successfully." });
  } catch (error) {
    console.log("deleteVendor error=>", error);
    return res.status(500).json({ message: error.message });
  }
};
