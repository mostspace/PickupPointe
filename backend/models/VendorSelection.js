const mongoose = require("mongoose");

const VendorSelectionSchema = new mongoose.Schema({
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    required: true,
  },
  primaryPurpose: {
    foodsDrops: { type: Boolean },
    packagedGoods: { type: Boolean },
    packagedMerchandise: { type: Boolean },
    looseGoods: { type: Boolean },
    courierDropOffs: { type: Boolean },
    personalMail: { type: Boolean },
    other: { type: Boolean },
  },
  sellMethod: {
    storeFront: { type: Boolean },
    marketOrPopups: { type: Boolean },
    foodTrucks: { type: Boolean },
    onlineOrders: { type: Boolean },
    other: { type: Boolean },
  },
  onlineOrders: {
    uberOrDoorDash: { type: Boolean },
    hotPlate: { type: Boolean },
    facebook: { type: Boolean },
    offerUp: { type: Boolean },
    adSites: { type: Boolean },
    socialMedia: { type: Boolean },
    businessWebsite: { type: Boolean },
    other: { type: Boolean },
  },
});

const VendorSelectionModel = mongoose.model(
  "VendorSelection",
  VendorSelectionSchema
);
module.exports = VendorSelectionModel;
