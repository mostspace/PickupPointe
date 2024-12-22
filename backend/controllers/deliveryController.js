const { createDoordashQuote, acceptDoordashQuote, cancelDoordashDelivery, getDoordashDeliveryStatus, createDoordashDelivery} = require("../utils/doordash");
const OrderModel = require("../models/Order");

const doordashEvents = {
  DASHER_CONFIRMED: "Pending",
  DASHER_CONFIRMED_PICKUP_ARRIVAL: "Pending",
  DASHER_PICKED_UP: "Pending",
  DASHER_CONFIRMED_DROPOFF_ARRIVAL: "Pending",
  DASHER_DROPPED_OFF: "Completed",
  DELIVERY_CANCELLED: "Cancelled",
  DELIVERY_RETURN_INITIALIZED: "Cancelled",
  DASHER_CONFIRMED_RETURN_ARRIVAL: "Cancelled",
  DELIVERY_RETURNED: "Cancelled",
  
}

exports.createDoorDashDelivery = async (req, res) => {
  const {
    pickupAddress,
    pickupPhoneNumber,
    dropOffAddress,
    dropOffPhoneNumber,
    pickupTime,
    dropOffTime,
    items,
  } = req.body;
  const response = await createDoordashDelivery({
    pickup_address: pickupAddress,
    pickup_phone_number: pickupPhoneNumber,
    dropoff_address: dropOffAddress,
    dropoff_phone_number: dropOffPhoneNumber,
    pickup_time: pickupTime,
    // dropoff_time: dropOffTime,
    // items
  })
  if (response.status) {
    return res.status(200).json(response.data);
  } else {
    return res.status(500).json({ message: response.message });
  }
};

exports.getDoorDashStatus = async (req, res) => {
  const id = req.params.id;
  
  const response = await getDoordashDeliveryStatus(id);
  if (response.status) {
    return res.status(200).json(response.data);
  } else {
    return res.status(500).json({ message: response.message });
  }
};

exports.cancelDoorDashDelivery = async (req, res) => {
  const id = req.params.id;

  const response = await cancelDoordashDelivery(id);
  if (response.status) {
    return res.status(200).json(response.data);
  } else {
    return res.status(500).json({ message: response.message });
  }
};

exports.createDoorDashQuote = async (req, res) => {
  const {
    pickupAddress,
    pickupPhoneNumber,
    dropOffAddress,
    dropOffPhoneNumber,
    pickupTime,
    dropOffTime,
    items,
  } = req.body;
  const response = await createDoordashQuote({
    pickup_address: pickupAddress,
    pickup_phone_number: pickupPhoneNumber,
    dropoff_address: dropOffAddress,
    dropoff_phone_number: dropOffPhoneNumber,
    pickup_time: pickupTime,
    // dropoff_time: dropOffTime,
    // items
  })
  if (response.status) {
    return res.status(200).json(response.data);
  } else {
    return res.status(500).json({ message: response.message });
  }
};

exports.acceptDoorDashQuote = async (req, res) => {
  const id = req.params.id;

  const response = await acceptDoordashQuote(id);
  
  if (response.status) {
    return res.status(200).json(response.data);
  } else {
    return res.status(500).json({ message: response.message });
  }
};

exports.doordashWebHook = async (req, res) => {
  const data = req.body;
  const orderId = data.external_delivery_id.replace("PUP-", "");
  console.log(orderId)
  await OrderModel.findByIdAndUpdate(orderId, {
    status: doordashEvents[data.event_name],
    deliveryStatus: data,
  });
  res.status(200).json({ message: "success" });
};