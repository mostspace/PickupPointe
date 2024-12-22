const bcrypt = require("bcrypt");
const crypto = require("crypto");
const {
  sendVerificationCode,
  sendRecoverCode,
  sendFeedback,
} = require("../utils/sendMails.js");
const { generateToken, decodeToken } = require("../utils/jwt.js");
const { isEmailValid, isAddressValid } = require("../utils/validators.js");
const { deleteFileFromS3UsingURL } = require("../utils/aws");

// Models
const Vendor = require("../models/Vendor.js");
const Location = require("../models/Location.js");
const VendorSelection = require("../models/VendorSelection.js");
const VendorVerification = require("../models/VendorVerification.js");
const VendorSetting = require("../models/VendorSetting.js");
const TabletVendorSetting = require("../models/TabletVendorSetting.js");
const VendorRecover = require("../models/VendorRecover.js");
const ItemCategory = require("../models/ItemCategory.js");

exports.quickRegister = async (req, res) => {
  const { email, password, role } = req.body;
  try {
    // Validate
    if (
      typeof email == "undefined" ||
      typeof password == "undefined" ||
      typeof role == "undefined"
    ) {
      return res.status(400).json({ message: "Bad request." });
    }

    if (!isEmailValid(email)) {
      return res.status(400).json({ message: "Email is not valid," });
    }

    // Check if the vendor is already exist
    const vendor = await Vendor.findOne({ email });
    if (vendor) {
      return res.status(400).json({ message: "Already exist email." });
    }

    // Hash the vendor's password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newVendor = await Vendor.create({
      email,
      password: hashedPassword,
      role,
    });

    if (!newVendor) {
      return res
        .status(400)
        .json({ message: "Failed to register new vendor." });
    }
    // Create a vendor setting
    await VendorSetting.create({ vendorId: newVendor._id });
    await TabletVendorSetting.create({ vendorId: newVendor._id });

    // Add default item categories
    await ItemCategory.create({ vendorId: newVendor._id, category: "Sides" });
    await ItemCategory.create({
      vendorId: newVendor._id,
      category: "Main Dishes",
    });
    await ItemCategory.create({
      vendorId: newVendor._id,
      category: "Appetizers",
    });
    await ItemCategory.create({
      vendorId: newVendor._id,
      category: "Beverages",
    });
    await ItemCategory.create({
      vendorId: newVendor._id,
      category: "Desserts",
    });
    await ItemCategory.create({ vendorId: newVendor._id, category: "Add-on" });

    // Send verification code
    try {
      // Create a verification code
      const verificationCode = crypto
        .randomBytes(3)
        .toString("hex")
        .toUpperCase();
      console.log("verification code", verificationCode);

      // Create a verification record
      const newVerificationCodeRecord = await VendorVerification.create({
        vendorId: newVendor._id,
        verificationCode,
        expiresAt: Date.now() + 3600000, // 1 hour expiry
      });
      if (!newVerificationCodeRecord) {
        return res.status(201).json({
          message:
            "Registered successfully but failed to generate verification code.",
        });
      }

      try {
        await sendVerificationCode(res, newVendor.email, verificationCode);
        const user = newVendor.toObject();
        delete user.password;
        return res.status(201).json({
          user,
        });
      } catch (error) {
        console.log("sending verification code function.", error);
        return res.status(201).json({
          message:
            "Registered successfully but failed to send verification code.",
        });
      }
    } catch (error) {
      console.log("creating vendor verification of vendor register", error);
      return res.status(201).json({
        message:
          "Registered successfully but failed to send verification code.",
      });
    }
  } catch (error) {
    console.log("register function.", error);
    return res.status(500).json({ message: error });
  }
};

exports.register = async (req, res) => {
  const {
    email,
    password,
    firstName,
    lastName,
    contactNumber,
    contactEmail,
    location,
    role,
    entityDetail,
    selection,
  } = req.body;
  try {
    // Validate
    if (
      typeof email == "undefined" ||
      typeof password == "undefined" ||
      typeof firstName == "undefined" ||
      typeof lastName == "undefined"
    ) {
      return res.status(400).json({
        message: "Bad request in email, password, firstName, lastName!",
      });
    }

    // Check if the email is valid
    if (!isEmailValid(email)) {
      return res.status(400).json({ message: "Email is not valid." });
    }

    // check if the address is valid
    const { countryCode, state, city, street, zipCode } = entityDetail;
    if (
      typeof countryCode == "undefined" ||
      typeof state == "undefined" ||
      typeof city == "undefined" ||
      typeof street == "undefined" ||
      typeof zipCode == "undefined"
    ) {
      return res.status(400).json({
        message: "Bad request in countryCode, state, city, street, zipCode",
      });
    }

    if (
      (await isAddressValid({ countryCode, state, city, street, zipCode })) ===
      false
    ) {
      return res.status(400).json({ message: "Invalid address." });
    }

    // Check if the vendor already exists
    const vendor = await Vendor.findOne({ email });
    if (vendor) {
      return res.status(400).json({ message: "Vendor already exists" });
    }

    // Hash the vendor's password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new vendor
    const newVendor = await Vendor.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      contactNumber,
      contactEmail,
      entityDetail,
      role,
    });
    if (!newVendor) {
      return res.status(400).json({ message: "Failed to add vendor." });
    }

    // Add a location
    const newLocation = await Location.create({
      vendorId: newVendor._id,
      ...location,
    });

    if (!newLocation) {
      await Vendor.deleteOne({ _id: newVendor._id });
      return res.status(400).json({ message: "Invalid location parameters." });
    }

    // Add vendor's selections
    const { primaryPurpose, sellMethod, onlineOrders } = selection;
    const newSelection = await VendorSelection.create({
      vendorId: newVendor._id,
      primaryPurpose,
      sellMethod,
      onlineOrders,
    });
    if (!newSelection) {
      await Vendor.deleteOne({ _id: newVendor._id });
      await Location.deleteOne({ _id: newLocation._id });
      return res.status(400).json({ message: "Invalid selection parameters." });
    }

    // Create a setting of vendor
    await VendorSetting.create({ vendorId: newVendor._id });
    await TabletVendorSetting.create({ vendorId: newVendor._id });

    // Add default item categories
    await ItemCategory.create({ vendorId: newVendor._id, category: "Sides" });
    await ItemCategory.create({
      vendorId: newVendor._id,
      category: "Main Dishes",
    });
    await ItemCategory.create({
      vendorId: newVendor._id,
      category: "Appetizers",
    });
    await ItemCategory.create({
      vendorId: newVendor._id,
      category: "Beverages",
    });
    await ItemCategory.create({
      vendorId: newVendor._id,
      category: "Desserts",
    });
    await ItemCategory.create({ vendorId: newVendor._id, category: "Add-on" });

    // Send verification code
    try {
      // Create a verification code
      const verificationCode = crypto
        .randomBytes(3)
        .toString("hex")
        .toUpperCase();
      console.log("verification code", verificationCode);

      // Create a verification record
      const newVerificationCodeRecord = await VendorVerification.create({
        vendorId: newVendor._id,
        verificationCode,
        expiresAt: Date.now() + 3600000, // 1 hour expiry
      });
      if (!newVerificationCodeRecord) {
        return res.status(201).json({
          message:
            "Registered successfully but failed to generate verification code.",
        });
      }

      try {
        await sendVerificationCode(res, newVendor.email, verificationCode);

        const user = newVendor.toObject();
        delete user.password;

        return res.status(201).json({
          user,
        });
      } catch (error) {
        console.log("sending verification code function.", error);
        return res.status(201).json({
          message:
            "Registered successfully but failed to send verification code.",
        });
      }
    } catch (error) {
      console.log("creating vendor verification of vendor register", error);
      return res.status(201).json({
        message:
          "Registered successfully but failed to send verification code.",
      });
    }
  } catch (error) {
    console.log("registerWithDetail:", error);
    return res.status(500).json({ message: error });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (typeof email == "undefined" || typeof password == "undefined") {
      return res.status(400).json({ message: "Bad request!" });
    }

    if (!isEmailValid(email)) {
      return res.status(400).json({ message: "Email is not valid" });
    }

    // Find the vendor
    const vendor = await Vendor.findOne({ email });
    if (!vendor) {
      return res.status(401).json({ message: "Invalid email." });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, vendor.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid password." });
    }

    const user = vendor.toObject();
    delete user.password;

    // Send verified info
    if (vendor.verified == false) {
      return res.status(200).json({
        user,
      });
    }

    // Generate token
    const token = generateToken({ _id: vendor._id, role: "vendor" });

    return res.status(200).json({
      token,
      user,
    });
  } catch (error) {
    console.log("login function.", error);
    return res.status(500).json({ message: error });
  }
};

exports.verifyVendor = async (req, res) => {
  const { email, confirmCode } = req.body;
  try {
    if (typeof email == "undefined" || typeof confirmCode == "undefined") {
      return res.status(400).json({ message: "Bad request!" });
    }

    if (!isEmailValid(email)) {
      return res.status(400).json({ message: "Email is not valid" });
    }

    // Find the vendor with email
    const vendor = await Vendor.findOne({ email });
    if (!vendor) {
      return res.status(404).json({ message: "Not registered email." });
    }

    // Check the confirmCode
    const verificationRecord = await VendorVerification.findOne({
      vendorId: vendor._id,
      verificationCode: confirmCode,
      expiresAt: { $gt: Date.now() },
    });
    if (!verificationRecord) {
      return res
        .status(400)
        .json({ message: "Invalid or expired confirmation code" });
    }

    vendor.verified = true;
    vendor.save();

    await VendorVerification.findByIdAndDelete(verificationRecord._id);
    return res.status(200).json({ message: "Email successfully verified" });
  } catch (error) {
    console.log("verifyVendor function.", error);
    return res.status(500).json({ message: error });
  }
};

exports.sendVerificationCode = async (req, res) => {
  const { email } = req.body;
  try {
    // Validate
    if (typeof email == "undefined") {
      return res.status(400).json({ message: "Bad request!" });
    }

    if (!isEmailValid(email)) {
      return res.status(400).json({ message: "Email is not valid" });
    }

    // Find the vendor with email
    const vendor = await Vendor.findOne({ email });
    if (!vendor) {
      return res.status(404).json({ message: "Not registered email." });
    }

    // Create a new confirm code
    const confirmCode = crypto.randomBytes(3).toString("hex").toUpperCase();

    const updateVerifyQuery = {
      $set: {
        vendorId: vendor._id,
        verificationCode: confirmCode,
        expiresAt: Date.now() + 3600000,
      },
    };

    // Create a user verification entry
    await VendorVerification.updateOne(
      { vendorId: vendor._id },
      updateVerifyQuery,
      {
        upsert: true,
      }
    );

    // Send verificationCode
    await sendVerificationCode(res, vendor.email, confirmCode);
    return res.status(201).json({ message: "Sent a new confirm code" });
  } catch (error) {
    console.log("sendVerificationCode function.", error);
    return res.status(500).json({ message: error });
  }
};

exports.sendRecoverCode = async (req, res) => {
  const { email } = req.body;
  try {
    // Validate
    if (typeof email == "undefined") {
      return res.status(400).json({ message: "Bad request!" });
    }

    if (!isEmailValid(email)) {
      return res.status(400).json({ message: "Email is not valid" });
    }

    // Find the vendor with email
    const vendor = await Vendor.findOne({ email });
    if (!vendor) {
      return res.status(404).json({ message: "Not registered email." });
    }

    // Create a new recover code
    const recoverCode = crypto.randomBytes(3).toString("hex").toUpperCase();

    const updateRecoverQuery = {
      $set: {
        vendorId: vendor._id,
        recoverCode: recoverCode,
        expiresAt: Date.now() + 3600000,
        recovered: false,
      }, // The fields you want to update or set
    };
    await VendorRecover.updateOne(
      {
        vendorId: vendor._id,
      },
      updateRecoverQuery,
      { upsert: true }
    );

    // Send recover code
    await sendRecoverCode(res, vendor.email, recoverCode);
    return res
      .status(201)
      .json({ message: "Sent recover code to your email." });
  } catch (error) {
    console.log("sendRecoverCode function.", error);
    res.status(500).json({ message: error });
  }
};

exports.sendFeedback = async (req, res) => {
  const { name, email, role, feedback_type, message } = req.body;

  try {
    // Send feedback email
    await sendFeedback(name, email, role, feedback_type, message);

    // Respond after email is successfully sent
    return res.status(200).json({ message: 'Feedback submitted successfully.' });
  } catch (error) {
    console.error('Error in sendFeedback:', error);
    return res.status(500).json({ message: 'Something went wrong. Please try again later.' });
  }
};

exports.recoverVendor = async (req, res) => {
  const { email, recoverCode } = req.body;
  try {
    //
    // Validate
    if (typeof email == "undefined" || typeof recoverCode == "undefined") {
      return res.status(400).json({ message: "Bad request!" });
    }

    if (!isEmailValid(email)) {
      return res.status(400).json({ message: "Email is not valid" });
    }

    // Find the vendor
    const vendor = await Vendor.findOne({ email: email });
    if (!vendor) {
      return res.status(404).json({ message: "Not registered vendor." });
    }

    // Find the recover code
    const recoverRecord = await VendorRecover.findOne({
      vendorId: vendor._id,
      recoverCode: recoverCode,
      expiresAt: { $gt: Date.now() },
    });
    if (!recoverRecord) {
      return res
        .status(400)
        .json({ message: "Invalid or expired recover code" });
    }

    // Set recovered
    recoverRecord.recovered = true;
    recoverRecord.save();

    return res.status(200).json({ message: "Valid Recover Code" });
  } catch (error) {
    console.log("recoverVendor function.", error);
    return res.status(500).json({ message: error });
  }
};

exports.createNewPassword = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Validate
    if (typeof email == "undefined" || typeof password == "undefined") {
      return res.status(400).json({ message: "Bad request!" });
    }

    if (!isEmailValid(email)) {
      return res.status(400).json({ message: "Email is not valid" });
    }
    // Find the vendor
    const vendor = await Vendor.findOne({ email: email });
    if (!vendor) {
      return res.status(404).json({ message: "Not registered vendor." });
    }

    // Check if the vendor can create new password.
    const recoverRecord = await VendorRecover.findOne({
      vendorId: vendor._id,
      recovered: true,
    });
    if (!recoverRecord) {
      return res.status(400).json({ message: "You can't create password." });
    }

    // Create new password
    const hashedPassword = await bcrypt.hash(password, 10);
    await Vendor.findByIdAndUpdate(vendor._id, { password: hashedPassword });
    recoverRecord.recovered = false;
    recoverRecord.save();
    return res
      .status(200)
      .json({ message: "Successfully created new password." });
  } catch (error) {
    console.log("createNewPassword:", error);
    return res.status(500).json({ message: error });
  }
};

exports.updateProfile = async (req, res) => {
  const {
    firstName,
    lastName,
    contactNumber,
    contactEmail,
    entityDetail,
    // avatar,
  } = req.body;
  const userId = req.userId;
  try {
    if (typeof entityDetail !== "undefined") {
      const { countryCode, state, city, street, zipCode } = entityDetail;
      if (
        typeof countryCode !== "undefined" &&
        typeof state !== "undefined" &&
        typeof city !== "undefined" &&
        typeof street !== "undefined" &&
        typeof zipCode !== "undefined"
      ) {
        if (
          (await isAddressValid({
            countryCode: entityDetail.countryCode,
            state: entityDetail.state,
            city: entityDetail.city,
            street: entityDetail.street,
            zipCode: entityDetail.zipCode,
          })) === false
        )
          return res.status(400).json({ message: "Invalid address." });
      }
    }

    const updateQuery = {
      $set: {
        firstName,
        lastName,
        contactNumber,
        contactEmail,
      },
    };
    // Find the vendor
    const vendor = await Vendor.findByIdAndUpdate(userId, updateQuery, {
      new: true,
    });

    if (!vendor) {
      return res.status(400).json({ message: "Not found vendor." });
    }

    vendor.entityDetail = {
      ...vendor.entityDetail,
      ...entityDetail,
    };

    // if (typeof avatar !== "undefined" && avatar !== vendor.avatar) {
    //   deleteFileFromS3UsingURL(vendor.avatar);
    //   vendor.avatar = avatar;
    // }

    await vendor.save();

    const user = vendor.toObject();
    delete user.password;
    return res.status(200).json({ user });
  } catch (error) {
    console.log("updateProfile function.", error);
    return res.status(500).json({ message: error });
  }
};

exports.changePassword = async (req, res) => {
  const { prevPassword, newPassword } = req.body;
  const userId = req.userId;

  try {
    // Find the user
    const vendor = await Vendor.findById(userId);

    // Compare password
    const isMatch = await bcrypt.compare(prevPassword, vendor.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Hash the user's password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    vendor.password = hashedPassword;
    vendor.save();

    return res.status(200).json({ message: "Password successfully changed." });
  } catch (error) {
    console.log("changePassword:", error);
    return res.status(500).json({ message: error });
  }
};

exports.updateFeeStructure = async (req, res) => {
  const { customerFee, passCreditCardFeeToCustomer } = req.body;
  const userId = req.userId;
  try {
    // check valid
    if (
      typeof customerFee !== "number" ||
      typeof passCreditCardFeeToCustomer !== "boolean"
    ) {
      console.log(typeof customerFee, typeof passCreditCardFeeToCustomer);
      return res.status(400).json({ message: "Invalid parameters." });
    }

    const opts = { runValidators: true, upsert: true, new: true };

    // Find the vendor and update fee structure.
    const vendorSetting = await VendorSetting.findOneAndUpdate(
      { vendorId: userId },
      {
        feeStructure: {
          customerFee,
          passCreditCardFeeToCustomer,
        },
      },
      opts
    );

    return res.status(200).json({ setting: vendorSetting });
  } catch (error) {
    console.log("updateFeeStructure function.", error);
    return res.status(500).json({ message: error });
  }
};

exports.getGlobalSettings = async (req, res) => {
  const userId = req.userId;
  try {
    // Get the vendor setting
    const vendorSetting = await VendorSetting.findOne({
      vendorId: userId,
    }).populate({
      path: "discounts",
      populate: [
        { path: "shop", select: "name" },
        { path: "locations", select: "address" },
      ],
    });

    if (!vendorSetting) {
      return res.status(500).json({ message: "Failed to get vendor setting." });
    }

    return res.status(200).json({ setting: vendorSetting });
  } catch (error) {
    console.log("getGlobalSetting function.", error);
    return res.status(500).json({ message: error });
  }
};

exports.setTaxRate = async (req, res) => {
  const { taxRate } = req.body;
  const userId = req.userId;
  try {
    if (typeof taxRate !== "number") {
      return res.status(400).json({ message: "Invalid rate." });
    }
    // Set tax rate
    const opts = { runValidators: true };
    const vendorSetting = await VendorSetting.findOneAndUpdate(
      { vendorId: userId },
      { taxRate },
      opts
    );
    if (!vendorSetting) {
      return res
        .status(400)
        .json({ message: "Vendor's settings do not exist." });
    }

    const updatedVendorSetting = await VendorSetting.findById(
      vendorSetting._id
    );
    return res.status(200).json({ setting: updatedVendorSetting });
  } catch (error) {
    console.log("setTaxRate function.", error);
    return res.status(500).json({ message: error });
  }
};

exports.setNotificationSetting = async (req, res) => {
  const userId = req.userId;
  try {
    // Find the vendor's setting
    const vendorSetting = await VendorSetting.findOne({ vendorId: userId });

    vendorSetting.settings = {
      ...vendorSetting.settings,
      ...req.body,
    };

    await vendorSetting.save();

    return res.status(200).json({ settings: vendorSetting.settings });
  } catch (error) {
    console.log("setNotificationSetting function.", error);
    return res.status(500).json({ message: error });
  }
};

exports.setDeliveryFees = async (req, res) => {
  const { useThirdParty, offerFreeMile, chargeBeyondTheFree, costPer } = req.body;
  const userId = req.userId;
  try {
    // validate

    let updateQuery = {
      courierDeliveryFees: {
        useThirdParty,
        offerFreeMile,
        chargeBeyondTheFree,
        costPer,
      },
    };

    // Find and update
    await VendorSetting.findOneAndUpdate(
      {
        vendorId: userId,
      },
      updateQuery
    );

    const updatedVendorSetting = await VendorSetting.findOne({
      vendorId: userId,
    });

    const { courierDeliveryFees } = updatedVendorSetting;
    return res.status(200).json({ courierDeliveryFees });
  } catch (error) {
    console.log("setDeliveryFee function.", error);
    return res.status(500).json({ message: error });
  }
};

exports.uploadAvatar = async (req, res) => {
  const photo = req.file ? req.file.location : "";
  const vendorId = req.userId;
  console.log("photo", photo);
  if (photo === "") {
    return res.status(400).json({ message: "Uploading failed." });
  }
  try {
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }
    await deleteFileFromS3UsingURL(vendor.avatar);

    vendor.avatar = photo;
    await vendor.save();

    return res.status(200).json({ avatar: vendor.avatar });
  } catch (error) {
    await deleteFileFromS3UsingURL(photo);
    console.log("uploadAvatar:", error);
    return res.status(500).json({ message: error });
  }
};
