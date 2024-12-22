const mongoose = require("mongoose");

const ShopCategorySchema = new mongoose.Schema(
  {
    photo: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt timestamps
  }
);

const ShopCategoryModel = mongoose.model("ShopCategory", ShopCategorySchema);
module.exports = ShopCategoryModel;
