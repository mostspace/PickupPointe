const dayjs = require("dayjs");
const {ObjectId} = require("mongoose").Types;
const OrderModel = require("../../../models/Order");
const LocationModel = require("../../../models/Location");
const MerchantModel = require("../../../models/Merchant");
const ItemStockModel = require("../../../models/ItemStock");
const ItemModel = require("../../../models/Item");
const {getPeriodDateRange} = require("../../../utils/date");
const {cache} = require("../../../utils/cache");
const {createDoordashDelivery} = require("../../../utils/doordash");

const getOrders = async (req, res) => {
  const merchantId = req.userId;
  try {
    const location = await MerchantModel.findById(merchantId, "locations").exec();
    if (!location) {
      return res.json({data: [], totalCount: 0, page: 1});
    }

    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;
    const status = req.query.status || "Submitted";
    const skip = (page - 1) * perPage;

    const searchQuery = {status};
    if (location) {
      searchQuery.pickupLocation = {$in: location.locations}
    }
    if (status === "Completed") {
      searchQuery.updatedAt = new Date();
    }

    const [result] = await OrderModel.aggregate([
      {
        $match: {
          ...searchQuery
        }
      },
      {
        $sort: {
          "time.pickupTime": -1
        }
      },
      {
        $facet: {
          orders: [
            {
              $lookup: {
                from: "shoppers",
                localField: "orderer",
                foreignField: "_id",
                as: "shopperInfo"
              }
            },
            {
              $project: {
                _id: 1,
                ordererName: {
                  $cond: {
                    if: { $gt: [{ $size: "$shopperInfo" }, 0] },
                    then: {
                      $concat: [
                        { $arrayElemAt: ["$shopperInfo.firstName", 0] },
                        " ",
                        { $arrayElemAt: ["$shopperInfo.lastName", 0] }
                      ]
                    },
                    else: { $toString: "$orderer" }
                  }
                },
                pickupTime: "$time.pickupTime",
                status: "$status",
                deliveryType: "$deliveryType",
                packageCount: { $size: "$package" },
                notes: 1
              }
            },
            { $skip: skip },
            { $limit: perPage }
          ],
          totalCount: [
            { $count: "count" }
          ]
        }
      }
    ]);

    return res.status(200).json({
      result: result.orders,
      totalCount: result.totalCount[0]?.count || 0,
      page
    });
  } catch (error) {
    return res.json({result: [], totalCount: 0, page: 1});
  }
};

const getOrderById = async (req, res) => {
  const orderId = req.params._id;
  const merchantId = req.userId;
  const location = await MerchantModel.findById(merchantId, "locations").exec();
  if (!location) {
    return res.json({});
  }

  try {
    const [order] = await OrderModel.aggregate([
      { $match: { _id: new ObjectId(orderId) } },
      {$lookup: {from: "shoppers", localField: "orderer", foreignField: "_id", as: "shopperInfo"}},
      {
        $addFields: {
          ordererName: {
            $cond: {
              if: { $gt: [{ $size: "$shopperInfo" }, 0] },
              then: {
                $concat: [
                  { $arrayElemAt: ["$shopperInfo.firstName", 0] },
                  " ",
                  { $arrayElemAt: ["$shopperInfo.lastName", 0] }
                ]
              },
              else: { $toString: "$orderer" }
            }
          }
        }
      },
      {$lookup: {from: "items", localField: "package.item", foreignField: "_id", as: "packageItems", pipeline: [{
            $project: {name: 1, defaultPrice: 1, _id: 1, photo: 1, categories: 1}
          }]
      }},
      {$lookup: {from: "items", localField: "package.replaced", foreignField: "_id", as: "packageReplaced", pipeline: [{
            $project: {name: 1, defaultPrice: 1, _id: 1, photo: 1, categories: 1}
          }]
      }},
      {$lookup: {from: "modifieritems", localField: "package.selectedItems", foreignField: "_id", as: "selectedItems"}},
      {
        $project: {
          _id: 1,
          orderer: 1,
          ordererName: 1,
          pickupLocation: 1,
          paymentId: 1,
          shopId: 1,
          package: {
            $map: {
              input: "$package",
              as: "pkg",
              in: {
                item: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: "$packageItems",
                        as: "item",
                        cond: { $eq: ["$$item._id", "$$pkg.item"] }
                      }
                    },
                    0
                  ]
                },
                replaced: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: "$packageReplaced",
                        as: "replacedItem",
                        cond: { $eq: ["$$replacedItem._id", "$$pkg.replaced"] }
                      }
                    },
                    0
                  ]
                },
                quantity: "$$pkg.quantity",
                selectedItems: {
                  $map: {
                    input: "$$pkg.selectedItems",
                    as: "selItem",
                    in: {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: "$selectedItems",
                            as: "sItem",
                            cond: { $eq: ["$$sItem._id", "$$selItem"] }
                          }
                        },
                        0
                      ]
                    }
                  }
                },
                variant: "$$pkg.variant"
              }
            }
          },
          deliveryType: 1,
          time: 1,
          fee: 1,
          contacts: 1,
          notes: 1,
          status: 1,
          total: 1,
          subTotal: 1,
          orderLog: 1,
        }
      }
    ]);

    if (!order) {
      return res.json({});
    }

    return res.json(order);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const confirmOrder = async (req, res) => {
  const merchantId = req.userId;
  const orderId = req.params._id;
  const {pickupTime} = req.body;

  const merchantLocation = await MerchantModel.findById(merchantId, "locations").exec()
  if (!merchantLocation) {
    return res.status(401).json({
      message: "You have no permission."
    });
  }
  
  if (merchantId) {
    const orderDetail = await OrderModel.findById(orderId, "deliveryType orderLocation time contacts pickupLocation subTotal total package")
      .populate("pickupLocation", "address contact")
      .populate("package.item", "name description");
    
    let deliveryResult;
    if (orderDetail && orderDetail.deliveryType === "Delivery") {
      const {street, city, state, zipCode} = orderDetail.pickupLocation.address;
      // TODO: Replace every constants.
      deliveryResult = await createDoordashDelivery({
        pickup_address: `${street}, ${city}, ${state}, ${zipCode}`,
        // pickup_phone_number: "+" + orderDetail.pickupLocation?.contact?.phoneNumber?.replace(/\D/g, ""),
        dropoff_address: orderDetail.orderLocation,
        dropoff_phone_number: "+" + orderDetail.contacts?.contactNumber?.replace(/\D/g, ""),
        pickupTime,
        tip: 0,
        items: orderDetail.package.map(pkg => ({
          name: pkg?.item?.name,
          description: pkg?.item?.description,
          quantity: pkg.quantity
        }))
      }, orderId);
      if (!deliveryResult.status) {
        return res.status(500).json({
          message: deliveryResult.message
        })
      }
    }
    
    await OrderModel.findOneAndUpdate({_id: orderId, pickupLocation: {$in: merchantLocation.locations}},
      {
        $set: {
          status: "Pending",
          time: {pickupDate: pickupTime, pickupTime: pickupTime},
          deliveryStatus: deliveryResult?.data
        },
        $push: {
          orderLog: {title: "Order confirmed by restaurant", logTime: dayjs().format("YYYY-MM-DD HH:mm:ss")}
        }
      });
    
    return res.json({
      message: "Order confirmed successfully."
    })
  } else {
    return res.status(401).json({
      message: "You have no permission."
    })
  }
}

const cancelOrder = async (req, res) => {
  const merchantId = req.userId;
  const orderId = req.params._id;

  const merchantLocation = await MerchantModel.findById(merchantId, "locations").exec()
  if (!merchantLocation) {
    return res.status(401).json({
      message: "You have no permission."
    });
  }

  if (merchantId) {
    await OrderModel.findOneAndUpdate({
      _id: orderId,
    }, {
      $set: {status: "Canceled"},
      $push: {
        orderLog: {
          title: "Order Canceled by restaurant",
          logTime: dayjs().format("YYYY-MM-DD HH:mm:ss")
        }
      }
    });
    return res.json({
      message: "Order canceled successfully."
    })
  } else {
    return res.status(401).json({
      message: "You have no permission."
    })
  }
}

const makeItemMakeOfStock = async (req, res) => {
  const {itemId, untilDay} = req.body;
  const merchantId = req.userId;

  const merchantLocation = await MerchantModel.findById(merchantId, "locations").exec();
  if (!merchantLocation) {
    return res.status(401).json({
      message: "You have no permission."
    });
  }

  const locationId = merchantLocation.locations[0];

  const outOfStockUntil = untilDay === "Today"
    ? dayjs().endOf("day").format("YYYY-MM-DD HH:mm:ss")
    : untilDay === "Tomorrow"
      ? dayjs().add(1, "day").endOf("day").format("YYYY-MM-DD HH:mm:ss")
      : "Forever";
  await ItemStockModel.findOneAndUpdate({item: itemId, location: locationId}, {currentQuantity: 0, outOfStockUntil}, {upsert: true});
  cache.set(`${itemId}.${locationId}`, 0);
  return res.json({
    status: "success"
  });
};

const refundOrderItem = async (req, res) => {
  const { itemId } = req.body;
  const orderId = req.params._id;
  try {
    const order = await OrderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (order.package?.length <= 1) {
      return await cancelOrder(req, res);
    }

    const itemToRemove = order.package.find(pkg => pkg.item.toString() === itemId);
    if (!itemToRemove) {
      return res.status(404).json({ message: "Item not found in order" });
    }

    const itemDetails = await ItemModel.findById(itemToRemove.item);
    if (!itemDetails) {
      return res.status(404).json({ message: "Item details not found" });
    }
    console.log(itemDetails)

    order.package = order.package.filter(pkg => pkg.item.toString() !== itemId);

    const itemTotal = itemToRemove.quantity * itemDetails.defaultPrice;
    order.total -= itemTotal;
    order.subTotal -= itemTotal;

    order.orderLog.push({
      logTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      title: "Item refunded",
      note: `Item with ID ${itemId} was refunded.`
    });

    await order.save();

    return res.json({ message: "Item refunded successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getReplaceableItems = async (req, res) => {
  const {categories} = req.query;
  const items = await ItemModel.find({
    categories: {$in: categories}
  }, "defaultPrice photo name").exec();

  return res.json(items)
}

const replaceItem = async (req, res) => {
  const { originalItem, replacedItem, quantity, orderId } = req.body;

  try {
    const order = await OrderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const itemIndex = order.package.findIndex(pkg => pkg.item.toString() === originalItem);
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Original item not found in order" });
    }

    const originalItemDetails = await ItemModel.findById(originalItem);
    const replacedItemDetails = await ItemModel.findById(replacedItem);

    if (!originalItemDetails || !replacedItemDetails) {
      return res.status(404).json({ message: "Item details not found" });
    }

    const originalItemTotal = order.package[itemIndex].quantity * originalItemDetails.defaultPrice;
    const replacedItemTotal = quantity * replacedItemDetails.defaultPrice;

    order.package[itemIndex].replaced = originalItem;
    order.package[itemIndex].item = replacedItem;
    order.package[itemIndex].quantity = quantity;

    order.subTotal = order.subTotal - originalItemTotal + replacedItemTotal;
    order.total = order.total - originalItemTotal + replacedItemTotal;

    await order.save();

    return res.json({ message: "Item replaced successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getOrders, getOrderById, confirmOrder, makeItemMakeOfStock, cancelOrder, refundOrderItem, getReplaceableItems, replaceItem
}