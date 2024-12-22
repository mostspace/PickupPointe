const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { isEmailValid, isPhoneValid } = require("../utils/validators");
const { generateToken, decodeToken } = require("../utils/jwt.js");
const { generateSecurePassword } = require("../utils/helpers.js");
// Models
const MerchantUser = require("../models/Merchant");
const TabletUserSetting = require("../models/MerchantSetting");
const TabletVendorSetting = require("../models/TabletVendorSetting");
const Feedback = require("../models/Feedback");
const Vendor = require("../models/Vendor");

const pickupIdToNumber = (pickupId) => {
  return parseInt(pickupId.replace("ID", ""), 10);
};

const numberToPickupId = (id) => {
  return "Id" + id;
};

exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const id = req.params.id;
  const vendorId = req.userId;
  const cPassword = currentPassword ? currentPassword : "";
  const nPassword = newPassword ? newPassword : "";

  try {
    const tabletUser = await MerchantUser.findById(id);
    if (!tabletUser) {
      return res.status(400).json({ message: "Invalid id" });
    }

    if (tabletUser.vendorId.toString() !== vendorId) {
      return res.status(400).json({ message: "This user is not yours." });
    }

    // Compare password
    if (cPassword !== tabletUser.password) {
      return res.status(401).json({ error: "Invalid password." });
    }

    tabletUser.password = nPassword;
    await tabletUser.save();

    return res.status(200).json({ message: "changed" });
  } catch (error) {
    console.log("changePassword:", error);
    return res.status(500).json({ message: error });
  }
};

exports.resetPassword = async (req, res) => {
  const id = req.params.id;
  const vendorId = req.userId;
  try {
    const tabletUser = await MerchantUser.findById(id);
    if (!tabletUser) {
      return res.status(400).json({ message: "Invalid id" });
    }

    if (tabletUser.vendorId.toString() !== vendorId) {
      return res.status(400).json({ message: "This user is not yours." });
    }

    tabletUser.password = generateSecurePassword();
    await tabletUser.save();

    return res.status(200).json({ newPassword: tabletUser.password });
  } catch (error) {
    console.log("resetPassword:", error);
    return res.status(500).json({ message: error });
  }
};

exports.addTabletUser = async (req, res) => {
  const vendorId = req.userId;
  const {
    password,
    firstName,
    lastName,
    contactNumber,
    contactEmail,
    locations,
    permissions,
    shop,
    status,
  } = req.body;

  if (
    typeof contactEmail == "undefined" ||
    typeof password == "undefined" ||
    typeof firstName == "undefined" ||
    typeof lastName == "undefined"
  ) {
    return res.status(400).json({ message: "Bad request." });
  }

  if (!isEmailValid(contactEmail)) {
    return res.status(400).json({ message: "Email is not valid," });
  }

  if (typeof contactNumber !== "undefined" && !isPhoneValid(contactNumber)) {
    return res.status(400).json({ message: "Phone is not valid," });
  }

  try {
    let idNum;
    let tempUser;
    do {
      idNum = crypto.randomInt(0, 10000000).toString().padStart(6, "0");
      console.log("idNum:", idNum);
      tempUser = await MerchantUser.findOne({ pickupId: "ID" + idNum });
    } while (tempUser);

    const exist = await MerchantUser.findOne({ contactEmail });
    if (exist) {
      return res.status(400).json({ message: "Email already taken" });
    }

    const newTabletUser = await MerchantUser.create({
      pickupId: "ID" + idNum,
      vendorId,
      password,
      firstName,
      lastName,
      contactNumber,
      contactEmail,
      locations,
      shop: shop?._id,
      status,
      permissions,
    });

    if (!newTabletUser) {
      return res.status(400).json({ message: "Failed to add user." });
    }

    await TabletUserSetting.create({ tabletUserId: newTabletUser._id });
    const updatedNewTabletUser = newTabletUser.toObject();
    delete updatedNewTabletUser.password;
    delete updatedNewTabletUser.vendorId;
    delete updatedNewTabletUser._id;
    return res.status(200).json({ user: updatedNewTabletUser });
  } catch (error) {
    console.log("addTabletUser function.", error);
    return res.status(500).json({ message: error });
  }
};

exports.getAllTabletUsers = async (req, res) => {
  const vendorId = req.userId;
  const query = req.query;

  const pageSize = query.pageSize ? query.pageSize : 10;
  const page = query.page ? query.page : 1;
  const locations = req.body.locations ? req.body.locations : [];
  const searchKey = query.searchKey ? query.searchKey : null;
  const status = query.status ? query.status : "all";
  const permissions = req.query.permissions
    ? req.query.permissions
    : ["tablet-user"];

  console.log("permissions", permissions);
  try {
    const offset = (page - 1) * pageSize;

    const findQuery = {
      vendorId,
      permissions: { $all: permissions },
    };

    if (searchKey) {
      findQuery.$or = [
        { firstName: { $regex: searchKey, $options: "i" } },
        { lastName: { $regex: searchKey, $options: "i" } },
        { contactEmail: { $regex: searchKey, $options: "i" } },
      ];
    }

    if (status !== "all") {
      findQuery.status = status;
    }

    if (locations.length !== 0) {
      findQuery.locations = { $all: locations };
    }

    // find all tabletUsers
    const tabletUsers = await MerchantUser.find(findQuery)
      .select("-password -vendorId")
      .populate({ path: "locations", select: "address" })
      .skip(offset)
      .limit(pageSize);

    const totalResults = await MerchantUser.countDocuments(findQuery);
    return res.status(200).json({ totalResults, users: tabletUsers });
  } catch (error) {
    console.log("getAllTabletUsers:", error);
    return res.status(500).json({ message: error });
  }
};

exports.getTabletUser = async (req, res) => {
  const id = req.params.id;
  const vendorId = req.userId;
  try {
    const tabletUser = await MerchantUser.findOne({ _id: id, vendorId })
      .select("-vendorId")
      .populate({ path: "locations", select: "address" });
    if (!tabletUser) {
      return res.status(400).json({ message: "Invalid id." });
    }

    return res.status(200).json({ user: tabletUser });
  } catch (error) {
    console.log("getTabletUser:", error);
    return res.status(500);
  }
};

exports.deleteTabletUser = async (req, res) => {
  const id = req.params.id;
  try {
    const tabletUser = await MerchantUser.findByIdAndDelete(id);
    if (!tabletUser) {
      return res.status(400).json({ message: "Invalid id." });
    }
    return res.status(200).json({});
  } catch (error) {
    console.log("deleteTabletUser:", error);
    return res.status(500).json({ message: error });
  }
};

exports.updateTabletUser = async (req, res) => {
  const id = req.params.id;
  const {
    firstName,
    lastName,
    contactNumber,
    contactEmail,
    locations,
    password,
    shop,
    status,
    permissions,
  } = req.body;

  if (contactEmail && !isEmailValid(contactEmail)) {
    return res.status(400).json({ message: "Email is not valid," });
  }

  if (
    typeof contactNumber !== "undefined" &&
    isPhoneValid(contactNumber) === false
  ) {
    return res.status(400).json({ message: "Phone is not valid," });
  }

  try {
    const updateQuery = {
      firstName,
      lastName,
      contactNumber,
      contactEmail,
      locations,
      status,
      shop,
      permissions,
    };
    
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateQuery.password = await bcrypt.hash(password, salt);
    }

    const tabletUser = await MerchantUser.findByIdAndUpdate(id, updateQuery, {
      new: true,
      runValidators: true,
    })
      .select("-password -vendorId")
      .populate({ path: "locations", select: "address" });
    if (!tabletUser) {
      return res.status(400).json({ message: "Invalid id." });
    }

    return res.status(200).json({ user: tabletUser });
  } catch (error) {
    console.log("updateTabletUser:", error);
    return res.status(500).json({ message: error });
  }
};

exports.login = async (req, res) => {
  const { email, pickupId, password } = req.body;

  if (typeof password === "undefined") {
    return res.status(400).json({ message: "Bad request" });
  }

  try {
    if (typeof pickupId !== "undefined") {
      const tabletUser = await MerchantUser.findOne({ pickupId });
      if (!tabletUser) {
        return res.status(404).json({ message: "User not found." });
      }

      // Compare password
      if (password !== tabletUser.password) {
        return res.status(401).json({ error: "Invalid password." });
      }

      if (tabletUser.status === "Suspended") {
        return res
          .status(401)
          .json({ error: "Your account has been suspended." });
      }

      const user = tabletUser.toObject();
      delete user.password;
      user.role = "user";
      // Generate token
      const token = generateToken({ _id: tabletUser._id, role: "tabletUser" });
      return res.status(200).json({
        token,
        user,
      });
    } else if (typeof email !== "undefined") {
      if (!isEmailValid(email)) {
        return res.status(400).json({ message: "Email is not valid" });
      }
      const vendor = await Vendor.findOne({ email });
      if (!vendor) {
        return res.status(401).json({ message: "Not registered" });
      }

      // Compare password
      const isMatch = await bcrypt.compare(password, vendor.password);
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid password." });
      }

      // Send verified info
      if (vendor.verified == false) {
        return res.status(200).json({
          user,
        });
      }

      // Generate token
      const token = generateToken({ _id: vendor._id, role: "tabletUser" });
      const user = {};
      user.firstName = vendor.firstName;
      user.lastname = vendor.lastName;
      user.role = "owner";

      return res.status(200).json({
        token,
        user,
      });
    }
  } catch (error) {
    console.log("tabletuser/login:", error);
    return res.status(500).json({ message: error });
  }
};

exports.getTabletUserSetting = async (req, res) => {
  const userId = req.userId;
  try {
    let isOwner = true;
    const vendor = await Vendor.findById(userId);
    if (!vendor) {
      isOwner = false;
    }

    if (isOwner === false) {
      const tabletUserSetting = await TabletUserSetting.findOneAndUpdate(
        {
          tabletUserId: userId,
        },
        { new: true, upsert: true }
      );
      return res.status(200).json({ setting: tabletUserSetting });
    } else if (isOwner === true) {
      console.log("vendorId", userId);
      const tabletVendorSetting = await TabletVendorSetting.findOneAndUpdate(
        { vendorId: userId },
        { vendorId: userId },
        { new: true, upsert: true }
      );

      return res.status(200).json({ setting: tabletVendorSetting });
    }
  } catch (error) {
    console.log("getTabletUserSetting", error);
    return res.status(500).json({ message: error });
  }
};

exports.updateTabletUserSetting = async (req, res) => {
  const { autoConfirmNewOrder, volume, printer, ratePickup } = req.body;
  const userId = req.userId;

  let isOwner = true;
  const vendor = await Vendor.findById(userId);
  if (!vendor) {
    isOwner = false;
  }

  try {
    const updateQuery = {
      autoConfirmNewOrder,
      volume,
      printer,
      ratePickup,
    };
    if (isOwner === false) {
      const updatedTabletUserSetting = await TabletUserSetting.findOneAndUpdate(
        { tabletUserId: userId },
        updateQuery,
        { upsert: true, new: true, runValidators: true }
      );
      return res.status(200).json({ setting: updatedTabletUserSetting });
    } else if (isOwner === true) {
      const updatedTabletVendorSetting =
        await TabletVendorSetting.findOneAndUpdate(
          { vendorId: userId },
          updateQuery,
          { upsert: true, new: true, runValidators: true }
        );
      return res.status(200).json({ setting: updatedTabletVendorSetting });
    }
  } catch (error) {
    console.log("updateTabletUserSetting:", error);
    return res.status(500).json({ message: error });
  }
};

exports.submitFeedback = async (req, res) => {
  const userId = req.userId;
  const { message } = req.body;
  if (typeof message === "undefined" || message === "") {
    return res.status(400).json({ message: "Bad request" });
  }
  let isOwner = true;
  const vendor = await Vendor.findById(userId);
  if (!vendor) {
    isOwner = false;
  }

  try {
    let feedback;
    if (isOwner === true) {
      feedback = await Feedback.create({
        userId,
        role: "vendor",
        message,
      });
    } else if (isOwner === false) {
      feedback = await Feedback.create({
        userId,
        role: "tabletUser",
        message,
      });
    }

    if (typeof feedback === "undefined") {
      return res.status(400).json({ message: "Failed to submit feedback." });
    }

    return res.status(200).json({ message: "Success." });
  } catch (error) {
    console.log("submitFeedback:", error);
    return res.status(500).json({ message: error });
  }
};
