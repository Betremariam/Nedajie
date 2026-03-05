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

app.use('/uploads', express.static('uploads'));

// Create super admin if not exists
const createSuperAdmin = async () => {
  try {
    const existingSuperAdmin = await prisma.admin.findFirst({
      where: { role: "super" },
    });
    if (!existingSuperAdmin) {
      const hashedPassword = await bcrypt.hash(process.env.SUPER_ADMIN_PASSWORD, 10);
      await prisma.admin.create({
        data: {
          name: "Super Admin",
          email: process.env.SUPER_ADMIN_EMAIL,
          password: hashedPassword,
          role: "super",
          isApproved: true,
        },
      });
      console.log("✅ Super Admin created successfully.");
    } else {
      console.log("ℹ️ Super Admin already exists.");
    }
  } catch (err) {
    console.error("❌ Failed to create Super Admin:", err.message);
  }
};

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Optional: await prisma.$connect(); 
    await createSuperAdmin();
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on 0.0.0.0:${PORT}`);
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
