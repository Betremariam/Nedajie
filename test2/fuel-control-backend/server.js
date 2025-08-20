import express, { json } from "express";
import { connect } from "mongoose";
import { config } from "dotenv";
import cors from "cors";
import bcrypt from "bcryptjs"; // Add bcrypt for hashing super admin password
import authRoutes from "./routes/authRoutes.js";
import fuelRoutes from "./routes/fuelRoutes.js";
import driverRoutes from "./routes/driverRoutes.js";
import attendantRoutes from "./routes/attendantRoutes.js";
import farmerRoutes from "./routes/farmerRoutes.js";
import adminsRoutes from "./routes/adminsRoutes.js";
import adminsAuthRoutes from "./routes/adminsAuthRoutes.js";

import Admin from "./models/Admin.js"; // Ensure this path matches your Admin model

config();

const app = express();

// Middlewares
app.use(cors());
app.use(json());

// Routes
app.use('/api/farmers', farmerRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/fuel", fuelRoutes); 
app.use("/api/drivers", driverRoutes);
app.use("/api/attendants", attendantRoutes);
app.use("/api/admins", adminsRoutes);
app.use("/api/admin-auth", adminsAuthRoutes);

app.use('/uploads', express.static('uploads'));

// Create super admin if not exists
const createSuperAdmin = async () => {
  try {
    const existingSuperAdmin = await Admin.findOne({ role: "super" });
    if (!existingSuperAdmin) {
      const hashedPassword = await bcrypt.hash(process.env.SUPER_ADMIN_PASSWORD, 10);
      const superAdmin = new Admin({
        name: "Super Admin",
        email: process.env.SUPER_ADMIN_EMAIL,
        password: hashedPassword,
        role: "super",
        isApproved: true
      });
      await superAdmin.save();
      console.log("✅ Super Admin created successfully.");
    } else {
      console.log("ℹ️ Super Admin already exists.");
    }
  } catch (err) {
    console.error("❌ Failed to create Super Admin:", err.message);
  }
};

// Connect to MongoDB and start the server
connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB connected");
    await createSuperAdmin(); // Ensure super admin is created after DB connects

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, '0.0.0.0', () =>
      console.log(`🚀 Server running on 0.0.0.0:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
  });
