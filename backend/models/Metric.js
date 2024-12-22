const mongoose = require("mongoose");

const MetricSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt timestamps
  }
);

const MetricModel = mongoose.model("Metric", MetricSchema);
module.exports = MetricModel;
