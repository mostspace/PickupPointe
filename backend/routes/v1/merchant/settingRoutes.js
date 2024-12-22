const settingCtrl = require("../../../controllers/v1/merchant/settingController");

module.exports = [
	{url: "/settings", requireAuth: true, method: "get", ctrl: settingCtrl.getMerchantSettings},
	{url: "/settings", requireAuth: true, method: "post", ctrl: settingCtrl.setSettings},
	{url: "/settings/feedback", requireAuth: true, method: "post", ctrl: settingCtrl.sendFeedback},
];

// This is test feedback message from merchant.