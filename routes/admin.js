const express = require("express");
const router = express.Router();
const Kyc = require("../models/Kyc");
const { authMiddleware } = require("../middleware/auth");
const { adminMiddleware } = require("../middleware/admin");

// GET ALL KYC SUBMISSIONS
router.get("/all", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const submissions = await Kyc.find().populate("userId", "fullName email");

    return res.json(
      submissions.map((s) => ({
        id: s._id,
        fullName: s.fullName,
        email: s.email,
        phone: s.phone,
        status: s.status,
        faceImageUrl: s.faceImage,
        idDocumentUrl: s.idDocument,
        submittedAt: s.createdAt,
      }))
    );
  } catch (err) {
    console.error("Admin fetch error:", err);
    res.status(500).json({ message: "Failed to load submissions" });
  }
});

// UPDATE STATUS
router.put("/update/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status } = req.body;

    if (!["verified", "rejected", "pending"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updated = await Kyc.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Submission not found" });
    }

    return res.json({ message: "Status updated", updated });
  } catch (err) {
    console.error("Update status error:", err);
    res.status(500).json({ message: "Could not update status" });
  }
});

module.exports = router;
