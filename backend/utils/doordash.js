const { DoorDashClient: client } = require("@doordash/sdk");
const { v4: uuidv4 } = require("uuid");

const deliveryIdPrefix = "PUP-";

const doorDashAccessKey = {
  developer_id: process.env.DOORDASH_DEVELOPER_ID,
  key_id: process.env.DOORDASH_KEY_ID,
  signing_secret: process.env.DOORDASH_SIGNING_SECRET,
};

const doorDashClient = new client(doorDashAccessKey);

const createDoordashDelivery = async (data, orderId) => {
  orderId = orderId || uuidv4();
  try {
    const response = await doorDashClient.createDelivery({
      external_delivery_id: `${deliveryIdPrefix}${orderId}`,
      ...data
    });
    console.log(response.data)
    return {status: true, data: response.data};
  } catch (error) {
    console.log("Create Doordash Delivery Error:", error);
    return {status: false, message: error.message};
  }
}

const createDoordashQuote = async (data, orderId) => {
  orderId = orderId || uuidv4();
  try {
    const response = await doorDashClient.deliveryQuote({
      external_delivery_id: `${deliveryIdPrefix}${orderId}`,
      ...data
    });
    return {status: true, data: response.data};
  } catch (error) {
    console.log("Create Doordash Quote Error:", error);
    return {status: false, message: error.message};
  }
}

const acceptDoordashQuote = async (orderId) => {
  try {
    const response = await doorDashClient.deliveryQuoteAccept(`${deliveryIdPrefix}${orderId}`);
    return {status: true, data: response.data};
  } catch (error) {
    console.log("Accept Doordash Quote Error:", error);
    return {status: false, message: error.message};
  }
}

const cancelDoordashDelivery = async (orderId) => {
  try {
    const response = await doorDashClient.cancelDelivery(`${deliveryIdPrefix}${orderId}`);
    return {status: true, data: response.data};
  } catch (error) {
    console.log("Cancel Doordash Delivery Error:", error);
    return {status: false, message: error.message};
  }
}

const getDoordashDeliveryStatus = async (orderId) => {
  try {
    const response = await doorDashClient.getDelivery(`${deliveryIdPrefix}${orderId}`);
    return {status: true, data: response.data};
  } catch (error) {
    console.log("Get Doordash Delivery Status Error:", error);
    return {status: false, message: error.message};
  }
}

module.exports = {
  doorDashClient,
  createDoordashQuote,
  acceptDoordashQuote,
  createDoordashDelivery,
  cancelDoordashDelivery,
  getDoordashDeliveryStatus
};
