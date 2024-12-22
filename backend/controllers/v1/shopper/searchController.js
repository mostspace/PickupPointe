const orderModel = require("../../../models/Order");
const Location = require("../../../models/Location");
const {ObjectId} = require("mongoose").Types;

const searchOrder = async (req, res) => {
  const shopperId = req.userId;
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
            // If no location found, search in string addresses
            termConditions.push({
              orderLocation: { $regex: term, $options: "i" }
            });
          }
        } catch (err) {
          // If there's an error, just search in string addresses
          termConditions.push({
            orderLocation: { $regex: term, $options: "i" }
          });
        }
      }
      
      if (termConditions.length > 0) {
        searchConditions.push({ $or: termConditions });
      }
    }

    searchConditions.push({ orderer: new ObjectId(shopperId) });

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