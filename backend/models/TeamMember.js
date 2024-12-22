const mongoose = require("mongoose");

const TeamMemberSchema = new mongoose.Schema(
  {
    email: {
      type: String, // Store as ObjectId for better querying
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    password: { type: String, required: true },
    role: {
      type: String,
      required: true,
      default: "member",
      enum: ["member", "admin"],
    },
    status: {
      type: String,
      required: true,
      default: "active",
      enum: ["active", "suspended"],
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt timestamps
  }
);

const TeamMemberModel = mongoose.model("TeamMember", TeamMemberSchema);
module.exports = TeamMemberModel;
