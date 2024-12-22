const bcrypt = require("bcrypt");
const crypto = require("crypto");
const {
  sendVerificationCode,
  sendRecoverCode,
  sendFeedback,
  sendSMS,
} = require("../utils/sendMails.js");
const { generateToken, decodeToken } = require("../utils/jwt.js");
const {
  isEmailValid,
  isAddressValid,
  isPhoneValid,
} = require("../utils/validators.js");
const { deleteFileFromS3UsingURL } = require("../utils/aws");

// Models
const Shopper = require("../models/Shopper");
const ShopperVerification = require("../models/ShopperVerification.js");
const ShopperRecover = require("../models/ShopperRecover.js");
const ShopperSetting = require("../models/ShopperSetting.js");
const UserPhoneVerification = require("../models/UserPhoneVerification.js");

exports.register = async (req, res) => {
  const { email, password, firstName, lastName, phoneNumber } = req.body;
  try {
    // Validate
    if (typeof email == "undefined" || typeof password == "undefined" || typeof phoneNumber == "undefined") {
      return res.status(400).json({ message: "Bad request!" });
    }

    if (!isEmailValid(email)) {
      return res.status(400).json({ message: "Email is not valid" });
    }

    if (!isPhoneValid(phoneNumber)) {
      return res.status(400).json({ message: "Phone number is not valid" });
    }
    // Check if the shopper already exists
    const shopper = await Shopper.findOne({ email: email });
    if (shopper) {
      return res.status(404).json({ message: "Shopper already exists" });
    }

    // Hash the shopper's password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new shopper
    try {
      const newShopper = await Shopper.create({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        contactNumber: phoneNumber
      });
      //Send verification code
      try {
        const verificationCode = crypto
          .randomBytes(3)
          .toString("hex")
          .toUpperCase();
        console.log("verification code", verificationCode);

        // Create a shopper setting
        await ShopperSetting.create({ shopperId: newShopper._id });

        // Create a shopper verification entry
        try {
          await ShopperVerification.create({
            shopperId: newShopper._id,
            verificationCode: verificationCode,
            expiresAt: Date.now() + 3600000, // 1 hour expiry
          });
        } catch (error) {
          return res.status(500).json({
            message: "Failed to generate verification code",
          });
        }

        await sendVerificationCode(res, newShopper.email, verificationCode);
      } catch (error) {
        console.log("send verfication code failed", error);
        return res
          .status(500)
          .json({ message: "Sending verification code failed." });
      }
      const user = newShopper.toObject();
      delete user.password;
      return res.status(201).json({
        user,
      });
    } catch (error) {
      console.log("add new shopper", error);
      return res.status(400).json({ message: "Bad Request." });
    }
  } catch (error) {
    console.log("shopper register:", error);
    return res.status(500).json({ message: error });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Validate
    if (typeof email == "undefined" || typeof password == "undefined") {
      return res.status(400).json({ message: "Bad request!" });
    }

    if (!isEmailValid(email)) {
      return res.status(400).json({ message: "Email is not valid." });
    }

    // Find the shopper
    const shopper = await Shopper.findOne({ email })
      .populate({ path: "payments" });
    if (!shopper) {
      return res.status(404).json({ message: "Not registerd email" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, shopper.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid password." });
    }
    // Send verified info
    if (shopper.verified == false) {
      return res.status(200).json({
        user: shopper,
      });
    }

    const user = shopper.toObject();
    delete user.password;
    // Generate token
    const token = generateToken({ _id: shopper._id, role: "shopper" });
    return res.status(200).json({
      token,
      user,
    });
  } catch (error) {
    console.log("shopper login:", error);
    return res.status(500).json({ message: error });
  }
};

exports.verifyShopper = async (req, res) => {
  const { email, confirmCode } = req.body;
  try {
    // Validate
    if (typeof email == "undefined" || typeof confirmCode == "undefined") {
      return res.status(400).json({ message: "Bad request!" });
    }

    if (!isEmailValid(email)) {
      return res.status(400).json({ message: "Email is not valid." });
    }

    // Find the shopper with email
    const shopper = await Shopper.findOne({ email });
    if (!shopper) {
      return res.status(404).json({ message: "Not registered email." });
    }

    // Check the confirmCode
    const verificationRecord = await ShopperVerification.findOne({
      shopperId: shopper._id,
      verificationCode: confirmCode,
      expiresAt: { $gt: Date.now() },
    });
    if (!verificationRecord) {
      return res
        .status(400)
        .json({ message: "Invalid or expired confirmation code" });
    }

    // Verify the shopper
    shopper.verified = true;
    shopper.save();

    await ShopperVerification.findByIdAndDelete(verificationRecord._id);
    return res.status(200).json({ message: "Email successfully verified" });
  } catch (error) {
    console.log("confirmUser:", error);
    return res.status(500).json({ message: error });
  }
};

exports.verifyPhoneOfShopper = async (req, res) => {};

exports.sendPhoneVerificationCode = async (req, res) => {
  const { phoneNumber } = req.body;
  if (!phoneNumber || !isPhoneValid(phoneNumber))
    return res.status(400).json({ message: "Phone is not valid." });
  try {
    const verificationCode = crypto
      .randomBytes(3)
      .toString("hex")
      .toUpperCase();
    console.log("verification code", verificationCode);

    const response = await sendSMS(phoneNumber, verificationCode);
    console.log(
      "SMS sent successfully",
      response.sid,
      "code:",
      verificationCode
    );
    // await UserPhoneVerification.create({
    //   userId:
    // })

    return res.status(200).json({ message: "Success!" });
  } catch (error) {
    console.log("sendPhoneVerificationCode error:", error);
    return res.status(200).json({ message: error.message });
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
      return res.status(400).json({ message: "Email is not valid." });
    }

    // Find the shopper with email
    const shopper = await Shopper.findOne({ email });
    if (!shopper) {
      return res.status(404).json({ message: "Not registered email." });
    }

    // Create new confirm code.
    const confirmCode = crypto.randomBytes(3).toString("hex").toUpperCase();

    const updateVerify = {
      $set: {
        shopperId: shopper._id,
        verificationCode: confirmCode,
        expiresAt: Date.now() + 3600000,
      },
    };

    // Create a user verification entry
    await ShopperVerification.updateOne(
      { shopperId: shopper._id },
      updateVerify,
      {
        upsert: true,
      }
    );

    // Send verificationCode
    await sendVerificationCode(res, shopper.email, confirmCode);
    return res.status(201).json({ message: "Sent a new confirm code" });
  } catch (error) {
    console.log("resendCode:", error);
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
      return res.status(400).json({ message: "Email is not valid." });
    }

    // Find the shopper with email
    const shopper = await Shopper.findOne({ email });
    if (!shopper) {
      return res.status(404).json({ message: "Not registered email." });
    }

    // Create a new recover code
    const recoverCode = crypto.randomBytes(3).toString("hex").toUpperCase();
    console.log("recover code", recoverCode);

    const updateRecover = {
      $set: {
        shopperId: shopper._id,
        recoverCode: recoverCode,
        expiresAt: Date.now() + 3600000,
        recovered: false,
      }, // The fields you want to update or set
    };
    await ShopperRecover.updateOne(
      {
        shopperId: shopper._id,
      },
      updateRecover,
      { upsert: true }
    );

    console.log("recovered");

    // Send recover code
    await sendRecoverCode(res, shopper.email, recoverCode);

    return res
      .status(201)
      .json({ message: "Sent recover code to your email." });
  } catch (error) {
    console.error("Error sending password reset email:", error);
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

exports.recoverShopper = async (req, res) => {
  const { email, recoverCode } = req.body;
  try {
    // Validate
    if (typeof email == "undefined" || typeof recoverCode == "undefined") {
      return res.status(400).json({ message: "Bad request!" });
    }

    if (!isEmailValid(email)) {
      return res.status(400).json({ message: "Email is not valid." });
    }

    // Find the shopper
    const shopper = await Shopper.findOne({ email: email });
    if (!shopper) {
      return res.status(404).json({ message: "Not registered shopper." });
    }

    // Find the recover code
    const recoverRecord = await ShopperRecover.findOne({
      shopperId: shopper._id,
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
    console.log("recoverShopper controller", error);
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
      return res.status(400).json({ message: "Email is not valid." });
    }

    // Find the shopper
    const shopper = await Shopper.findOne({ email: email });
    if (!shopper) {
      return res.status(404).json({ message: "Not registered shopper." });
    }

    // Check if the shopper can create new password.
    const recoverRecord = await ShopperRecover.findOne({
      shopperId: shopper._id,
      recovered: true,
    });
    if (!recoverRecord) {
      return res.status(400).json({ message: "You can't create password" });
    }

    // Create new password
    const hashedPassword = await bcrypt.hash(password, 10);
    await Shopper.findByIdAndUpdate(shopper._id, { password: hashedPassword });
    recoverRecord.recovered = false;
    recoverRecord.save();

    return res
      .status(200)
      .json({ message: "Successfully created new password." });
  } catch (error) {
    console.log("createNewPassword function.", error);
    return res.status(500).json({ message: error });
  }
};

exports.updateProfile = async (req, res) => {
  const {
    firstName,
    lastName,
    contactNumber,
    email,
    deliveryAddress,
    specialDeliveryInstruction,
    payments,
    primaryPayment
  } = req.body;

  const userId = req.userId;
  try {
    if (
      (contactNumber && isPhoneValid(contactNumber)) ===
      false
    ) {
      return res.status(400).json({ message: "Contact number is not valid." });
    }

    let coordinates = {};

    if (deliveryAddress) {
      const { countryCode, zipCode, state, city, street } = deliveryAddress;

      const result = await isAddressValid({
        countryCode,
        state,
        city,
        street,
        zipCode,
      });
      if (result === false) {
        return res.status(400).json({ message: "Street1: invalid street" });
      }
      coordinates.longitude = result?.longitude;
      coordinates.latitude = result?.latitude;
    }

    const updateQuery = {
      firstName,
      lastName,
      contactNumber,
      email,
      deliveryAddress,
      coordinates,
      specialDeliveryInstruction,
      payments,
      primaryPayment
    };

    // Find the shopper and update
    const shopper = await Shopper.findByIdAndUpdate(userId, updateQuery, {
      new: true,
    });

    if (!shopper) {
      return res.status(400).json({ message: "Shopper not found." });
    }

    // if (typeof avatar !== "undefined" && avatar !== shopper.avatar) {
    //   deleteFileFromS3UsingURL(shopper.avatar);
    //   shopper.avatar = avatar;
    // }

    await shopper.save();

    const user = shopper.toObject();
    delete user.password;

    return res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
  }
};

exports.setNotificationSetting = async (req, res) => {
  const shopperId = req.userId;
  const { ready, delivery, dropOff } = req.body;
  try {
    // Update shopper's setting
    await ShopperSetting.findOneAndUpdate(
      { shopperId },
      {
        notification: { ready, delivery, dropOff },
      }
    );

    const shopperSetting = await ShopperSetting.findOne({ shopperId });
    console.log("updated", shopperSetting.notification);

    return res.status(200).json({ notification: shopperSetting.notification });
  } catch (error) {
    console.log("setNotificationSetting:", error);
    return res.status(500).json({ message: error });
  }
};

exports.getNotificationSetting = async (req, res) => {
  const shopperId = req.userId;
  try {
    // Get shoppers's notification setting
    const shopperSetting = await ShopperSetting.findOne({ shopperId });

    return res.status(200).json({ notification: shopperSetting.notification });
  } catch (error) {
    console.log("setNotificationSetting:", error);
    return res.status(500).json({ message: error });
  }
};

exports.getSetting = async (req, res) => {
  const shopperId = req.userId;
  try {
    const shopperSetting = await ShopperSetting.findOne({
      shopperId,
    });

    return res.status(200).json({ setting: shopperSetting });
  } catch (error) {
    console.log("getSetting:", error);
    return res.status(500).json({ message: error });
  }
};

exports.changePassword = async (req, res) => {
  const { prevPassword, newPassword } = req.body;
  const userId = req.userId;

  try {
    // Validate
    if (
      typeof prevPassword == "undefined" ||
      typeof newPassword == "undefined"
    ) {
      return res.status(400).json({ message: "Bad request!" });
    }

    // Find the user
    const shopper = await Shopper.findById(userId);

    // Compare password
    const isMatch = await bcrypt.compare(prevPassword, shopper.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Hash the user's password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    shopper.password = hashedPassword;
    shopper.save();

    return res.status(200).json({ message: "Password successfully changed." });
  } catch (error) {
    console.log("changePassword:", error);
    return res.status(500).json({ message: error });
  }
};

exports.uploadAvatar = async (req, res) => {
  const photo = req.file ? req.file.location : "";
  const shopperId = req.userId;
  console.log("photo", photo);
  if (photo === "") {
    return res.status(400).json({ message: "Uploading failed." });
  }
  try {
    const shopper = await Shopper.findById(shopperId);
    if (!shopper) {
      return res.status(404).json({ message: "Shopper not found" });
    }
    await deleteFileFromS3UsingURL(shopper.avatar);

    shopper.avatar = photo;
    await shopper.save();

    return res.status(200).json({ avatar: shopper.avatar });
  } catch (error) {
    await deleteFileFromS3UsingURL(photo);
    console.log("uploadAvatar:", error);
    return res.status(500).json({ message: error });
  }
};
