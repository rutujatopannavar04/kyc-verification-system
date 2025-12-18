const express = require("express");
const Kyc = require("../models/Kyc");
const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

const router = express.Router();

// =======================
//  SUBMIT KYC
// =======================
router.post(
  "/submit",
  auth,
  upload.fields([
    { name: "faceImage", maxCount: 1 },
    { name: "idDocument", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      console.log("🔹 KYC submit hit");
      console.log("User from token:", req.user);
      console.log("Body:", req.body);
      console.log("Files:", req.files);

      const { fullName, email, phone, address, idNumber } = req.body;

      if (!req.files || !req.files.faceImage || !req.files.idDocument) {
        return res
          .status(400)
          .json({ message: "Face image and ID document are required" });
      }

      const kyc = new Kyc({
        userId: req.user.id, // comes from authMiddleware
        fullName,
        email,
        phone,
        address,
        idNumber,
        faceImage: req.files.faceImage[0].filename,
        idDocument: req.files.idDocument[0].filename,
      });

      const saved = await kyc.save();
      console.log("✅ KYC saved:", saved);

      res.json({ message: "KYC submitted successfully" });
    } catch (err) {
      console.error("❌ KYC submit error:", err);
      res.status(500).json({ message: "KYC error", error: err.message });
    }
  }
);

// =======================
//  GET USER'S KYC STATUS
// =======================
router.get("/status", auth, async (req, res) => {
  try {
    console.log("🔹 Fetching KYC status for user:", req.user.id);

    const record = await Kyc.findOne({ userId: req.user.id });

    if (!record) {
      console.log("ℹ️ No KYC found for this user");
      return res.status(404).json({ message: "No KYC found" });
    }

    res.json({
      id: record._id,
      status: record.status,
      fullName: record.fullName,
      email: record.email,
      phone: record.phone,
      address: record.address,
      idNumber: record.idNumber,
      faceImageUrl: `/uploads/${record.faceImage}`,
      idDocumentUrl: `/uploads/${record.idDocument}`,
      submittedAt: record.createdAt,
      reviewedAt: record.updatedAt,
      rejectionReason: record.rejectionReason || "",
    });
  } catch (err) {
    console.error("❌ Error fetching KYC status:", err);
    res
      .status(500)
      .json({ message: "Error fetching KYC status", error: err.message });
  }
});

module.exports = router;
