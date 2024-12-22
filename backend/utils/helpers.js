const path = require("path");
const crypto = require("crypto");
const { URL } = require("url");

const hashFilename = (filename) => {
  const hashedFilename = Date.now() + crypto.randomBytes(3).toString("hex");
  // Date.now() + crypto.randomBytes(3).toString("hex") + path.extname(filename);
  return hashedFilename;
};

function generateSecurePassword(length = 10) {
  return crypto
    .randomBytes(length)
    .toString("base64")
    .slice(0, length)
    .replace(/\+/g, "0") // Replace '+' to avoid URL encoding issues
    .replace(/\//g, "1"); // Replace '/' to avoid URL encoding issues
}

module.exports = {
  hashFilename,
  generateSecurePassword,
};
