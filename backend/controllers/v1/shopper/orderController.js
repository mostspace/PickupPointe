const dayjs = require("dayjs");
const {ObjectId} = require("mongoose").Types;
const OrderModel = require("../../../models/Order");
const {getPeriodDateRange} = require("../../../utils/date");

const getOrderAggregate = [{
  $lookup: {
    from: "shops", localField: "shopId", foreignField: "_id", as: "shopInfo",
    pipeline: [{
      $project: {name: 1, vendorId: 1, _id: 1, logo: 1}
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
  const shopperId = new ObjectId(req.userId);

  const params = {
    ...req.query,
    page: parseInt(req.query.page || 1),
    itemsPerPage: parseInt(req.query.itemsPerPage || 10),
    deliveryType: req.query.deliveryType || "Pickup",
    periodType: req.query.periodType || "All",
    search: req.query.searchKeyword || "",
  };

  let condition = {
    deliveryType: params.deliveryType,
    orderer: shopperId
  };

  const { startDate } = getPeriodDateRange(params.periodType);

  if (startDate) {
    condition['time.pickupDate'] = { 
      $gte: dayjs(startDate).format('YYYY-MM-DD')
    };
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
  console.log(searchConditions);

  try {
    const result = await OrderModel.aggregate([
      {
        $match: {...condition}
      },
      ...getOrderAggregate,
      ...(searchConditions.length > 0 ? [{
        $match: {
          $or: searchConditions
        }
      }] : []),
      {
        $sort: {
          createdAt: -1
        }
      },
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
    const itemDetail = order.packageInfo.find(item => item._id.toString() === packageItem.item.toString());
    return {
      _id: itemDetail._id,
      ...(itemDetail || {}),
      quantity: packageItem.quantity,
      modifiers: packageItem.selectedItems,
      variant: packageItem.variant,
    };
  });
  return res.json(order);
};

const withdrawOrder = async (req, res) => {
  const _id = new ObjectId(req.params._id);
  if (!_id) {
    return res.status(400).json({message: "Not a valid url!"});
  }
  await OrderModel.findOneAndUpdate({_id}, {status: "Canceled"});
  return await getOrderById(req, res);
};

const getActiveOrders = async (req, res) => {
  const shopperId = new ObjectId(req.userId);

  let condition = {
    status: {$in: ["Pending", "Submitted"]},
    orderer: shopperId
  }
  let data = await OrderModel.aggregate([
    {
      $match: {...condition}
    },
    {
      $sort: {
        createdAt: -1
      }
    },
    ...getOrderAggregate,
  ]);

  data = data.map(item => {
    const packageInfo = item.package.map(packageItem => {
      const matchedPackageInfo = item.packageInfo.find(packageInfo => packageInfo._id.toString() === packageItem.item.toString());
      return {...packageItem, ...matchedPackageInfo}
    })
    delete item.packageInfo;
    return {
      ...item,
      shopInfo: item.shopInfo[0],
      locationInfo: item.locationInfo[0],
      package: packageInfo,
    }
  })
  return res.json(data);
};

module.exports = {
  getOrders, getActiveOrders, getOrderById, withdrawOrder
}