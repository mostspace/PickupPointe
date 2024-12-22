const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ModifierCategorySchema = new Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
    },
    category: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ModifierCategory", ModifierCategorySchema);
