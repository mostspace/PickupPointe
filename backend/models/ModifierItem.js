const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ModifierItemSchema = new Schema(
  {
    photo: { type: String, default: "" },
    name: { type: String },
    price: { type: Number },
    isInStock: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ModifierItem", ModifierItemSchema);
