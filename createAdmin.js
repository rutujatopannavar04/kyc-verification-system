require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

async function createAdmin() {
  try {
    const MONGO_URI = process.env.MONGO_URI || process.env.MONGO_URL;

    if (!MONGO_URI) {
      console.error("❌ MONGO_URI or MONGO_URL missing in .env");
      process.exit(1);
    }

    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");

    const email = "admin@gmail.com";
    const existing = await User.findOne({ email });

    if (existing) {
      console.log("ℹ️ Admin already exists");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

    await User.create({
      fullName: "Admin User",
      email,
      password: hashedPassword,
      role: "admin"
    });

    console.log("🎉 Admin created successfully!");
    process.exit(0);

  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}

createAdmin();
