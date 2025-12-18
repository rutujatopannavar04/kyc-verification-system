require("dotenv").config();  // LOAD .env FIRST

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

// Import routes
const authRoutes = require("./routes/auth");
const kycRoutes = require("./routes/kyc");
const adminRoutes = require("./routes/admin");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ------- FIX: LOAD ENV THEN CONNECT DB -------
const mongoURI = process.env.MONGO_URL;

if (!mongoURI) {
  console.error("❌ ERROR: MONGO_URL is missing in .env!");
  process.exit(1);
}

mongoose
  .connect(mongoURI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/kyc", kycRoutes);
app.use("/api/admin", adminRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
