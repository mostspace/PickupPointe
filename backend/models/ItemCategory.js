const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ItemCategorySchema = new Schema({
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("ItemCategory", ItemCategorySchema);
