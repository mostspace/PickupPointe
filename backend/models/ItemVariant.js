const mongoose = require("mongoose");

const ItemVariantSchema = new mongoose.Schema({
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    required: true,
  },
  name: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
});

const ItemVariantModel = mongoose.model("ItemVariant", ItemVariantSchema);
module.exports = ItemVariantModel;
