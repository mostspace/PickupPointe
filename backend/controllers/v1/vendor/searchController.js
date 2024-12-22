const orderModel = require("../../../models/Order");
const Location = require("../../../models/Location");
const Shop = require("../../../models/Shop");
const {ObjectId} = require("mongoose").Types;

const searchOrder = async (req, res) => {
  const vendorId = req.userId;
  try {
    const { query: searchQuery = "" } = req.query;
    if (!searchQuery.trim()) {
      return res.json({
        success: true,
        result: [],
        totalCount: 0,
        page: 1
      });
    }

    const shops = await Shop.find({ vendorId: new ObjectId(vendorId) }).select('_id');
    const shopIds = shops.map(shop => shop._id);

    const searchTerms = searchQuery.trim().split(" ");
    const searchConditions = [];

    for (const term of searchTerms) {
      const cleanedTerm = term.replace(/^(PP|DD|SS)/, '');
      const termConditions = [];

      // Search by _id string match
      if (cleanedTerm.length > 0) {
        termConditions.push({
          $expr: {
            $regexMatch: {
              input: { $toString: "$_id" },
              regex: cleanedTerm
            }
          }
        });
      }

      // Search by location
      if (term.length > 0) {
        try {
          const locationIds = await Location.find({
            $or: [
              { "address.zipCode": new RegExp(term, 'i') },
              { "address.street": new RegExp(term, 'i') },
              { "address.city": new RegExp(term, 'i') },
              { "address.state": new RegExp(term, 'i') }
            ]
          }).select("_id");

          if (locationIds.length > 0) {
            termConditions.push({
              orderLocation: { $in: locationIds.map(loc => loc._id) }
            });
          } else {
            termConditions.push({
              orderLocation: { $regex: term, $options: "i" }
            });
          }
        } catch (err) {
          termConditions.push({
            orderLocation: { $regex: term, $options: "i" }
          });
        }
      }

      if (termConditions.length > 0) {
        searchConditions.push({ $or: termConditions });
      }
    }

    searchConditions.push({ shopId: { $in: shopIds } });

    const query = searchConditions.length > 0
      ? { $and: searchConditions }
      : {};

    const totalCount = await orderModel.countDocuments(query);

    const orders = await orderModel.find(query)
      .select('_id orderLocation status deliveryType')
      .populate({
        path: "orderLocation",
        model: "Location",
        select: "address"
      });

    return res.json({
      success: true,
      result: orders,
      totalCount,
      page: 1
    });

  } catch (error) {
    return res.json({
      success: true,
      result: [],
      totalCount: 0,
      page: 1
    });
  }
};

module.exports = {
  searchOrder
}