const Shop = require("../../../models/Shop");
const Location = require("../../../models/Location");

const getLocations = async (req, res) => {
  const query = req.query;
  const vendorId = req.userId;
  let findQuery = {vendorId};
  if (query.shopId) {
    let shopData = await Shop.findById(query.shopId).exec();
    if (shopData) {
      findQuery._id = {$in: shopData?.locations?.map(location => location._id)};
    }
  }
  try {
    let result = Location.find(findQuery, "address contact _id coordinates name vendorId");
    if (query.itemsPerPage && query.page) {
      result = result
        .skip((query.page - 1) * query.itemsPerPage)
        .limit(query.itemsPerPage);
    }
    result = await result;
    const totalCount = await Location.countDocuments(findQuery);
    return res.json({totalCount, result});
  } catch (e) {
    console.log("getAllLocations:", error);
    return res.status(500).json({ message: error });
  }
}

const getLocationById = async (req, res) => {

}

module.exports = {
  getLocations,
  getLocationById
}