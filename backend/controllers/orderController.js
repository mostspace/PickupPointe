const {ObjectId} = require("mongoose").Types;
const OrderModel = require("../models/Order");
const LocationModel = require("../models/Location");
const MerchantModel = require("../models/Merchant");
const ItemStockModel = require("../models/ItemStock");
const {Types} = require("mongoose");
const dayjs = require("dayjs");
const {cache} = require("../utils/cache");
const SocketService = require('../socket/service');

const placeOrder = async (req, res) => {
  try {
    const {orderer, paymentId, shopId, pickupLocation, package, deliveryType, orderLocation, time, fee, contacts, notes, status, total, subTotal} = req.body;

    const parsedPackage = JSON.parse(package);
    const parsedTime = JSON.parse(time);
    const parsedFee = JSON.parse(fee);
    const parsedContacts = JSON.parse(contacts);

    // Add stock availability check
    for (const packageItem of parsedPackage) {
      const stockItem = await ItemStockModel.findOne({
        location: pickupLocation,
        item: packageItem.item
      });

      if (!stockItem || stockItem.currentQuantity < packageItem.quantity) {
        return res.status(400).json({
          message: "Insufficient stock for one or more items in your order."
        });
      }
    }

    const newOrder = new OrderModel({
      pickupLocation,
      orderer,
      paymentId,
      shopId,
      package: parsedPackage,
      deliveryType,
      orderLocation,
      time: parsedTime,
      fee: parsedFee,
      contacts: parsedContacts,
      notes,
      status: "Submitted",
      total,
      subTotal,
      orderLog: [{
        logTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        title: "Order submitted to restaurant",
      }]
    });

    const savedOrder = await newOrder.save();
    
    // Update stock quantities after successful order
    for (const packageItem of parsedPackage) {
      let itemStock = await ItemStockModel.findOneAndUpdate(
        {
          location: pickupLocation,
          item: packageItem.item
        },
        {
          $inc: { currentQuantity: -packageItem.quantity }
        }
      );
      cache.set(`${pickupLocation}.${packageItem.item}`, itemStock.currentQuantity);
    }
    
    // Emit order to restaurant
    const merchant = await MerchantModel.findOne({locations: {$in: [pickupLocation]}});
    if (merchant) {
      SocketService.emitToUser(merchant._id.toString(), "order.new", savedOrder);
    }

    res.status(201).json({
      message: "Order placed successfully",
      order: savedOrder
    });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({message: "Error placing order", error});
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find({})
      .populate({
        path: "shopId",
        populate: {
          path: "categories"
        }
      })
      .populate({
        path: "package.item",
        populate: {
          path: "categories"
        }
      })
      .populate({
        path: "package.selectedItems"
      })
      .populate({
        path: "orderer", // Populates the orderer field
        select: "firstName lastName" // Select only firstName and lastName fields
      })
      .sort({ createdAt: -1 });

    for (let order of orders) {
      if (order.deliveryType === "Pickup" && order.orderLocation) {
        const location = await LocationModel.findById(order.orderLocation);
        order.orderLocation = JSON.stringify(location);
      }
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error retrieving orders:", error);
    res.status(500).json({ message: "Error retrieving orders", error });
  }
}

const getOrderById = async (req, res) => {
  let _id = req.params.id;
  if (!_id) {
    return res.status(400).json({ message: "Not found id in your url." });
  }

  let order = await OrderModel.findById(_id)
    .populate("shopId", "name")
    .populate("orderLocation", "address")
    .populate("package.item", "name photo itemId")
    .populate("orderer", "firstName lastName")
    .sort({ createdAt: -1 })
    .exec();

  return res.json(order);
}

const getOrdersByLocation = async (req, res) => {
  try {
    const {locationId} = req.params;

    const orders = await OrderModel.find({
      orderLocation: locationId
    })
      .populate("shopId")
      .populate("package.item")

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error retrieving orders:", error);
    res.status(500).json({message: "Error retrieving orders", error});
  }
}

const updateOrder = async (req, res) => {
  try {
    const {id} = req.params;
    const updatedData = req.body;

    const updatedOrder = await OrderModel.findByIdAndUpdate(id, updatedData, {new: true});

    if (!updatedOrder) {
      return res.status(404).json({message: "Order not found"});
    }

    res.status(200).json({
      message: "Order updated successfully", order: updatedOrder
    });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({message: "Error updating order", error});
  }
};

const deleteOrder = async (req, res) => {
  try {
    const {id} = req.params;

    const deletedOrder = await OrderModel.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({message: "Order not found"});
    }

    res.status(200).json({
      message: "Order deleted successfully", order: deletedOrder
    });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({message: "Error deleting order", error});
  }
};

module.exports = {
  placeOrder, getOrders, getOrdersByLocation, updateOrder, deleteOrder, getOrderById
};