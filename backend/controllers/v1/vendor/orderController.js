
const {ObjectId} = require("mongoose").Types;
const OrderModel = require("../../../models/Order");
const ServiceAvailabilityModel = require("../../../models/ServiceAvailability");
const dayjs = require("dayjs");
const {data} = require("express-session/session/cookie");
const {getDaysFromWeekDays, getPeriodDateRange} = require("../../../utils/date");

const getOrderAggregate = [{
  $lookup: {
    from: "shops", localField: "shopId", foreignField: "_id", as: "shopInfo",
    pipeline: [{
      $project: {name: 1, vendorId: 1, _id: 1}
    }]
  }}, {
  $lookup: {
    from: "locations", localField: "orderLocation", foreignField: "_id", as: "locationInfo",
    pipeline: [{
      $project: {address: 1, _id: 1}
    }]
  }}, {
  $lookup: {
    from: "items", localField: "package.item", foreignField: "_id", as: "packageInfo",
    pipeline: [{
      $project: {name: 1, _id: 1, photo: 1, defaultPrice: 1, itemId: 1}
    }]
  }}, {
  $lookup: {
    from: "shoppers", localField: "orderer", foreignField: "_id", as: "ordererInfo",
    pipeline: [{
      $project: {firstName: 1, lastName: 1, _id: 1}
    }]
  }}, {
  $lookup: {
    from: "modifieritems", localField: "package.selectedItems", foreignField: "_id", as: "modifierItemsInfo",
    pipeline: [{
      $project: {name: 1, price: 1, photo: 1, _id: 1}
    }]
  }
}];

const getOrders = async (req, res) => {
  const vendorId = new ObjectId(req.userId);
  const params = {
    ...req.query,
    page: parseInt(req.query.page || 1),
    itemsPerPage: parseInt(req.query.itemsPerPage || 10),
    deliveryType: req.query.deliveryType || "Pickup",
    statusType: req.query.statusType || "All",
    periodTime: req.query.periodTime || "All",
    search: req.query.searchKeyword || "",
  };

  let orderCondition = {
    deliveryType: params.deliveryType
  }

  if (params.statusType !== "All") {
    orderCondition.status = params.statusType;
  }


  if (params.periodTime !== "All") {
    console.log(params.periodTime)
    const {startDate} = getPeriodDateRange(params.periodTime);
    if (startDate) {
      orderCondition['time.pickupDate'] = {
        $gte: dayjs(startDate).format('YYYY-MM-DD')
      };
      console.log(orderCondition['time.pickupDate'])
    }
  }

  if (params.locations) {
    orderCondition.orderLocation = {$in: params.locations.map(location => new ObjectId(location))};
  }

  const searchConditions = [];
  if (params.search) {
    const orderIdPattern = /^(PP|DD|SS)[a-fA-F0-9]{24}$/
    if (orderIdPattern.test(params.search)) {
      searchConditions.push({
        "_id": new ObjectId(params.search.replace(/(PP|DD|SS)/g, "")),
      });
    } else {
      const searchRegex = new RegExp(params.search, 'i');
      searchConditions.push(
        {"packageInfo.name": searchRegex},
        {"packageInfo.itemId": searchRegex},
        {"ordererInfo.firstName": searchRegex},
        {"ordererInfo.lastName": searchRegex},
        {"shopInfo.name": searchRegex}
      );
    }
  }

  try {
    const result = await OrderModel.aggregate([
      {
        $match: {...orderCondition}
      },
      {
        $sort: {
          createdAt: -1
        }
      },
      ...getOrderAggregate,
      {
        $match: {
          "shopInfo.vendorId": vendorId
        }
      },
      ...(searchConditions.length > 0 ? [{
        $match: {
          $or: searchConditions
        }
      }] : []),
      {
        $facet: {
          orders: [
            {$skip: (params.page - 1) * params.itemsPerPage},
            {$limit: params.itemsPerPage}
          ],
          totalCount: [{$count: "count"}]
        }
      },
      {
        $project: {
          orders: 1,
          totalCount: {$arrayElemAt: ["$totalCount.count", 0]}
        }
      }
    ]);

    const totalCount = result.length > 0 ? result[0].totalCount : 0;
    let orders = result.length > 0 ? result[0].orders : [];

    orders = orders.map(order => {
      order.package = order.package.map(packageItem => {
        const itemDetail = order.packageInfo.find(item => item._id.toString() === packageItem.item.toString());
        return {
          _id: itemDetail._id,
          ...(itemDetail || {}),
          quantity: packageItem.quantity,
          variant: packageItem.variant
        };
      });
      return order;
    })
    res.status(200).json({result: orders, totalCount, page: params.page});
  } catch (error) {
    console.error("Error retrieving orders:", error);
    res.status(500).json({message: "Error retrieving orders", error});
  }
};

const getOrderById = async (req, res) => {
  const _id = new ObjectId(req.params._id);
  if (!_id) {
    return res.status(400).json({message: "Not a valid url!"});
  }

  let order = await OrderModel.aggregate([
    {
      $match: {_id},
    },
    ...getOrderAggregate
  ]).exec();
  if (order.length === 0) {
    return res.status(400).json({message: "Not a valid url!"});
  }

  order = order[0]
  order.package = order.package.map(packageItem => {
    console.log(order.modifierItemsInfo);
    const itemDetail = order.packageInfo.find(item => item._id.toString() === packageItem.item.toString());
    return {
      _id: itemDetail._id,
      ...(itemDetail || {}),
      quantity: packageItem.quantity,
      variant: packageItem.variant,
      modifiers: packageItem.selectedItems,
    };
  });
  return res.json(order);
};

const getOrderCalendar = async (req, res) => {
  const {shopId, locationId, month} = req.query;

  let serviceData = await ServiceAvailabilityModel.find({
    date: {
      $gte: dayjs(month, "YYYY-MM").startOf('month').format("YYYY-MM-DD"),
      $lte: dayjs(month, "YYYY-MM").endOf('month').format("YYYY-MM-DD")
    },
    locationId
  }, "date deliveryTime pickupTime").exec();

  let data = await OrderModel.aggregate([
    {
      $match : {
        // shopId: new ObjectId(shopId),
        orderLocation: new ObjectId(locationId),
        "status": {$in: ["Pending", "Completed"]},
        "time.pickupTime": {
          $gte: dayjs(month, "YYYY-MM").startOf('month').toISOString(),
          $lte: dayjs(month, "YYYY-MM").endOf('month').toISOString()
        },
      }
    }, {
      $project: {
        orderDate: {$substr: ["$time.pickupTime", 0, 10]},
        status: 1,
        deliveryType: 1,
      }
    }, {
      $group: {
        _id: {
          orderDate: "$orderDate",
          status: "$status",
          deliveryType: "$deliveryType"
        },
        count: { $sum: 1 }
      }
    }, {
      $sort: {
        "_id.status": -1,
        "_id.deliveryType": 1,
      }
    }
  ]);

  let result = data.map((item, idx) => {
    const { orderDate, status, deliveryType } = item._id;

    return {
      date: orderDate,
      count: item.count,
      deliveryType: deliveryType,
      status: status,
    };
  });
  return res.json({result, serviceData});
}

const saveServiceAvailability = async (req, res) => {
  const {date, deliveryTime, pickupTime, locationId, isWeek, month} = req.body;
  if (!locationId) {
    return res.status(400).json({success: false});
  }
  try {
    let data;
    const days = isWeek ? getDaysFromWeekDays(month, date) : [date];

    for (let date of days) {
      let exists = await ServiceAvailabilityModel.findOne({date, locationId}).exec();
      if (exists) {
        data = await ServiceAvailabilityModel.findOneAndUpdate({date, locationId}, {
          $set: {
            pickupTime: {...pickupTime},
            deliveryTime: {...deliveryTime},
          }
        }).exec();
      } else {
        data = new ServiceAvailabilityModel({
          date,
          locationId,
          pickupTime: {...pickupTime},
          deliveryTime: {...deliveryTime},
        });
        await data.save();
      }
    }

    return res.json(req.body);
  } catch (err) {
    console.log(err)
    return res.status(400).json({success: false});
  }
};

module.exports = {
  getOrders, getOrderById, getOrderCalendar, saveServiceAvailability
}