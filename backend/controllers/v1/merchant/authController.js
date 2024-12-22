const MerchantUser = require("../../../models/Merchant");
const Vendor = require("../../../models/Vendor");
const { generateMerchantToken } = require("../../../utils/jwt");
const { isEmailValid } = require("../../../utils/validators");
const bcrypt = require("bcrypt");

// Constants
const ERROR_MESSAGES = {
  BAD_REQUEST: "Bad request",
  USER_NOT_FOUND: "User not found.",
  INVALID_PASSWORD: "Invalid password.",
  ACCOUNT_SUSPENDED: "Your account has been suspended.",
  INVALID_EMAIL: "Email is not valid",
  NOT_REGISTERED: "Not registered",
};

const handleMerchantLogin = async (pickupId, password) => {
  const merchant = await MerchantUser
    .findOne({ contactEmail: pickupId })
    .populate("shop", "name logo photo");
  if (!merchant) {
    throw { status: 404, message: ERROR_MESSAGES.USER_NOT_FOUND };
  }

  const isPasswordValid = await bcrypt.compare(password, merchant.password); 
  if (!isPasswordValid) {
    throw { status: 401, message: ERROR_MESSAGES.INVALID_PASSWORD };
  }

  if (merchant.status === "Suspended") {
    throw { status: 401, message: ERROR_MESSAGES.ACCOUNT_SUSPENDED };
  }

  const user = merchant.toObject();
  delete user.password;
  user.role = "user";
  return {
    token: generateMerchantToken({ _id: merchant._id, role: "merchant" }),
    merchant,
  };
};


const login = async (req, res) => {
  const { pickupId, password } = req.body;

  if (!password) {
    return res.status(400).json({ message: ERROR_MESSAGES.BAD_REQUEST });
  }

  try {
    let loginResponse;

    if (pickupId) {
      loginResponse = await handleMerchantLogin(pickupId, password);
    } else {
      return res.status(400).json({ message: ERROR_MESSAGES.BAD_REQUEST });
    }

    return res.status(200).json(loginResponse);
  } catch (error) {
    console.error("Login error:", error);
    return res.status(error.status || 500).json({ 
      message: error.message || "Internal server error" 
    });
  }
};

module.exports = {
  login
};
