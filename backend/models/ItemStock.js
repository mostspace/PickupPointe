const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ItemStockSchema = new Schema(
	{
		location: {
			type: Schema.Types.ObjectId,
			ref: "Location"
		},
    item: {
      type: Schema.Types.ObjectId,
      ref: "Item"
    },
    currentQuantity: {
      type: Number,
      default: 0
    },
    outOfStockUntil: {
      type: String
    }
	},
	{timestamp: true}
);

module.exports = mongoose.model("ItemStock", ItemStockSchema);
