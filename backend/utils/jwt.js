const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET
    // { expiresIn: process.env.TOKEN_EXPIRE_TIME }
  );
};

const generateMerchantToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {expiresIn: process.env.TOKEN_EXPIRE_TIME }
  )
}

const decodeToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { generateToken, decodeToken, generateMerchantToken };
