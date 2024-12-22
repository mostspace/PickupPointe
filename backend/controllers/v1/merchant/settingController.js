const MerchantSettingModel = require("../../../models/MerchantSetting");
const Merchant = require("../../../models/Merchant");
const {sendFeedback: sendFeedbackMessage} = require("../../../utils/sendMails");

const getMerchantSettings = async (req, res) => {
	const merchantId = req.userId;
	const merchantSetting = await MerchantSettingModel.findOne({ merchant: merchantId });
	if (!merchantSetting) {
		return res.json({
			autoConfirmNewOrder: false,
			volume: "loud",
			printer: "",
			ratePickup: 3,
			appVersion: {
				version: "1.0.0",
				isUpdatable: false,
			},
		})
	}
	return res.json(merchantSetting);
};

const setSettings = async (req, res) => {
	const merchantId = req.userId;
	const {key, value} = req.body;
	const merchantSetting = await MerchantSettingModel.findOneAndUpdate(
		{ merchant: merchantId },
		{ $set: { [key]: value } },
		{ new: true, upsert: true }
	);
	return res.json(merchantSetting);
}

const sendFeedback = async (req, res) => {
	const merchantId = req.userId;
	const merchant = await Merchant.findById(merchantId);
	const { message } = req.body;
	if (!merchant) {
		return res.status(401).json({message: "You are not authenticated."});
	}
	console.log(merchant)
	
	const { firstName, lastName, contactEmail} = merchant;
	try {
		await sendFeedbackMessage(`${firstName} ${lastName}`, contactEmail, "merchant", "Feedback", message);
		
		return res.status(200).json({ message: 'Feedback submitted successfully.' });
	} catch (error) {
		console.error('Error in sendFeedback:', error);
		return res.status(500).json({ message: 'Something went wrong. Please try again later.' });
	}
};

module.exports = {
	getMerchantSettings,
	setSettings,
	sendFeedback
};