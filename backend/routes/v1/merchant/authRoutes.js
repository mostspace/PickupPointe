const authCtrl = require("../../../controllers/v1/merchant/authController");

module.exports = [
  {url: "/auth/login", method: "post", ctrl: authCtrl.login},
];