const dayjs = require("dayjs");
const isSameOrBefore = require("dayjs/plugin/isSameOrBefore");
const isSameOrAfter = require("dayjs/plugin/isSameOrAfter");
const advancedFormat = require("dayjs/plugin/advancedFormat");
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(advancedFormat);

const orderModel = require("../../../models/Order");
const ItemModel = require("../../../models/Item");
const ShopperModel = require("../../../models/Shopper");
const ShopModel = require("../../../models/Shop");
const {ObjectId} = require("mongoose").Types;

const getPeriodInfo = async (params) => {
  let startDate, endDate;
  endDate = dayjs();
  if (params === "week") {
    startDate = dayjs().startOf('week');
  } else if (params === "last_week") {
    startDate = dayjs().subtract(1, 'week').startOf('week');
    endDate = dayjs().subtract(1, 'week').endOf('week');
  } else if (params === "3month") {
    startDate = dayjs().subtract(3, 'months').startOf('day');
  } else if (params === "6month") {
    startDate = dayjs().subtract(6, 'months').startOf('day');
  }

  return {
    startDate,
    endDate
  };
}

const getIncomeInfo = async (startDate, endDate, period) => {
  try {
    const orders = await orderModel.find({
      "time.pickupTime": {
        $gte: startDate.toISOString(),
        $lte: endDate.toISOString()
      }
    });

    let groupedData;

    if (period === "week" || period === "last_week") {
      groupedData = orders.reduce((acc, order) => {
        const day = dayjs(order.time.pickupTime).format('dddd');
        if (!acc[day]) {
          acc[day] = { totalIncome: 0, subTotalIncome: 0, orderCount: 0 };
        }
        acc[day].totalIncome += order.total || 0;
        acc[day].subTotalIncome += order.subTotal || 0;
        acc[day].orderCount += 1;
        return acc;
      }, {});
    } else if (period === "3month" || period === "6month") {
      groupedData = orders.reduce((acc, order) => {
        const month = dayjs(order.time.pickupTime).format('MMM YYYY');
        if (!acc[month]) {
          acc[month] = { totalIncome: 0, subTotalIncome: 0, orderCount: 0 };
        }
        acc[month].totalIncome += order.total || 0;
        acc[month].subTotalIncome += order.subTotal || 0;
        acc[month].orderCount += 1;
        return acc;
      }, {});
    }

    return groupedData;
  } catch (error) {
    console.error("Error fetching income info:", error);
    throw new Error("Failed to fetch income information");
  }
}

const getGeneralProfit = async (startDate, endDate) => {
  try {
    const orders = await orderModel.find({
      "time.pickupTime": {
        $gte: startDate.toISOString(),
        $lte: endDate.toISOString()
      }
    });

    let totalItemsSold = 0;
    let totalProfit = 0;
    const itemSales = {};

    orders.forEach(order => {
      totalProfit += order.subTotal || 0;

      order.package.forEach(pkg => {
        const itemId = pkg.item.toString();
        const quantity = pkg.quantity || 0;

        totalItemsSold += quantity;

        if (!itemSales[itemId]) {
          itemSales[itemId] = { soldCount: 0 };
        }

        itemSales[itemId].soldCount += quantity;
      });
    });

    const topSoldItems = await ItemModel.find({
      _id: { $in: Object.keys(itemSales) }
    }).lean();

    const topItems = topSoldItems.map(item => ({
      name: item.name,
      photo: item.photo,
      soldCount: itemSales[item._id.toString()].soldCount
    }));

    topItems.sort((a, b) => b.soldCount - a.soldCount);
    const limitedTopItems = topItems.slice(0, 7);
    console.log(limitedTopItems)

    return {
      totalItemsSold,
      totalProfit,
      topItems: limitedTopItems
    };
  } catch (error) {
    console.error("Error fetching general profit info:", error);
    throw new Error("Failed to fetch general profit information");
  }
}

const getOverviewInfo = async (startDate, endDate) => {
  try {
    const orders = await orderModel.find({
      "time.pickupTime": {
        $gte: startDate.toISOString(),
        $lte: endDate.toISOString()
      }
    });

    const overview = orders.reduce(
      (acc, order) => {
        acc.totalOrders += 1;
        acc.totalIncome += order.total || 0;
        acc.subTotalIncome += order.subTotal || 0;

        if (order.status === "Completed") {
          acc.completedOrders += 1;
        } else if (order.status === "Pending") {
          acc.pendingOrders += 1;
        }

        return acc;
      },
      {
        totalOrders: 0,
        completedOrders: 0,
        pendingOrders: 0,
        totalIncome: 0,
        subTotalIncome: 0
      }
    );

    return overview;
  } catch (error) {
    console.error("Error fetching overview info:", error);
    throw new Error("Failed to fetch overview information");
  }
}

const getRecentOrders = async (startDate, endDate, deliveryType) => {
  try {
    let orderQuery = {
      "time.pickupTime": {
        $gte: startDate.toISOString(),
        $lte: endDate.toISOString()
      }
    }
    if (deliveryType !== "All") {
      orderQuery.deliveryType = deliveryType;
    }
    const orders = await orderModel
      .find(orderQuery)
      .sort({"time.pickupTime": -1})
      .limit(5)
      .populate('shopId', 'name');

    const recentOrders = await Promise.all(orders.map(async order => {
      let ordererName;
      if (ObjectId.isValid(order.orderer)) {
        const shopper = await ShopperModel.findById(new ObjectId(order.orderer)).select('firstName lastName');
        ordererName = shopper ? `${shopper.firstName} ${shopper.lastName.charAt(0)}` : 'Unknown';
      } else {
        ordererName = order.orderer ? `${order.orderer.split(" ")[0]} ${order.orderer.split(" ")[1]?.charAt(0)}` : 'Unknown';
      }

      const uniqueItemCount = order.package.length;

      let orderNumberPrefix;
      switch (order.deliveryType) {
        case "Pickup":
          orderNumberPrefix = "PP";
          break;
        case "Delivery":
          orderNumberPrefix = "DD";
          break;
        default:
          orderNumberPrefix = "SS";
      }
      const orderNumber = `${orderNumberPrefix}${order._id}`;

      return {
        _id: order._id,
        orderNumber,
        pickupDate: order.time.pickupDate,
        shopName: order.shopId.name,
        ordererName,
        orderType: order.deliveryType,
        uniqueItemCount
      };
    }));

    return recentOrders;
  } catch (error) {
    console.error("Error fetching recent orders:", error);
    throw new Error("Failed to fetch recent orders");
  }
}

const getDashboardInfo = async (req, res) => {
  const { type, period, deliveryType } = req.query;
  
  const { startDate, endDate } = await getPeriodInfo(period);
  
  let incomeInfo, generalProfit, overviewInfo, recentOrders;
  
  if (type === "income" || type === "all") {
    incomeInfo = await getIncomeInfo(startDate, endDate, period);
  }
  if (type === "generalProfit" || type === "all") {
    generalProfit = await getGeneralProfit(startDate, endDate);
  }
  if (type === "overview" || type === "all") {
    overviewInfo = await getOverviewInfo(startDate, endDate);
  }
  if (type === "recentOrders" || type === "all") {
    recentOrders = await getRecentOrders(startDate, endDate, deliveryType);
  }

  return res.json({ incomeInfo, generalProfit, overviewInfo, recentOrders });
}

module.exports = {
  getDashboardInfo
};