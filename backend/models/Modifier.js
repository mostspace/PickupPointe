const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ModifierSchema = new Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
    },
    name: { type: String },
    required: { type: Number },
    max: { type: Number },
    modifierItems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ModifierItem",
      },
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ModifierCategory",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Modifier", ModifierSchema);
