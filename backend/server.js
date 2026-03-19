import "dotenv/config";
import express, { json } from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import prisma from "./lib/prisma.js";
import authRoutes from "./routes/authRoutes.js";
import fuelRoutes from "./routes/fuelRoutes.js";
import driverRoutes from "./routes/driverRoutes.js";
import attendantRoutes from "./routes/attendantRoutes.js";
import farmerRoutes from "./routes/farmerRoutes.js";
import adminsRoutes from "./routes/adminsRoutes.js";
import adminsAuthRoutes from "./routes/adminsAuthRoutes.js";
import stationOwnerRoutes from './routes/stationOwnerRoutes.js';
import federalRoutes from "./routes/federalRoutes.js";
import fuelWorkflowRoutes from "./routes/fuelWorkflowRoutes.js";

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
app.use("/api/owners", stationOwnerRoutes);
app.use("/api/federal", federalRoutes);
app.use("/api/fuel-workflow", fuelWorkflowRoutes);

app.use('/uploads', express.static('uploads'));

// Initialize System - Create Federal/Super admins if not exists
const initializeSystem = async () => {
  try {
    // 1. Create Federal Admin from ENV
    const existingFederal = await prisma.admin.findFirst({
      where: { role: "federal" },
    });
    if (!existingFederal && process.env.FEDERAL_EMAIL) {
      const hashedPassword = await bcrypt.hash(process.env.FEDERAL_PASSWORD || "FederalSecure123", 10);
      await prisma.admin.create({
        data: {
          name: "Federal Admin",
          email: process.env.FEDERAL_EMAIL,
          password: hashedPassword,
          role: "federal",
          isApproved: true,
        },
      });
      console.log("✅ Federal Admin created successfully.");
    }

    // 2. Create fallback Super Admin if none exists
    const existingSuperAdmin = await prisma.admin.findFirst({
      where: { role: "super" },
    });
    if (!existingSuperAdmin) {
      const hashedPassword = await bcrypt.hash("SuperSecure123", 10);
      await prisma.admin.create({
        data: {
          name: "System Super Admin",
          email: "super@admin.com",
          password: hashedPassword,
          role: "super",
          isApproved: true,
          region: "National"
        },
      });
      console.log("✅ Default Super Admin created successfully.");
    }
  } catch (err) {
    console.error("❌ initialization error:", err.message);
  }
};

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Optional: await prisma.$connect(); 
    await initializeSystem();
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
    
    server.on('close', () => {
      console.log('⚠️ Server closed explicitly!');
    });
    
    // Ensure the server socket keeps the event loop alive
    server.ref();
  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
  }
};

startServer();
