const mongoose = require("mongoose");

const kycSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    fullName: String,
    email: String,
    phone: String,
    address: String,
    idNumber: String,

    faceImage: String,
    idDocument: String,

    status: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true } // IMPORTANT for admin panel
);

module.exports = mongoose.model("Kyc", kycSchema);
