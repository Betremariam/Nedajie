import prisma from "../../lib/prisma.js";
import bcrypt from "bcryptjs";
import { hash } from "bcryptjs";

export async function registerVehicle(req, res) {
  try {
    const { ownerName, phone, vehicleType, carPlate } = req.body;

    if (!req.file) {
      return res.status(400).json({ msg: "Document is required" });
    }

    const existing = await prisma.vehicle.findUnique({
      where: { phone },
    });
    if (existing) return res.status(400).json({ msg: "Vehicle phone already registered" });

    // Fetch fuel capacity from vehicle type config
    const vehicleConfig = await prisma.vehicleTypeConfig.findUnique({
      where: { vehicleType: vehicleType.toLowerCase() }
    });

    if (!vehicleConfig) {
      return res.status(400).json({ 
        msg: `Fuel capacity not configured for vehicle type: ${vehicleType}. Please contact federal admin.` 
      });
    }

    // Auto-generate password from last 4 digits of phone + first 2 letters of plate
    const defaultPassword = phone.slice(-4) + carPlate.slice(0, 2).toUpperCase();
    const hashed = await hash(defaultPassword, 10);
    
    const admin = await prisma.admin.findUnique({ where: { id: req.user.id } });

    const vehicle = await prisma.vehicle.create({
      data: {
        ownerName,
        phone,
        vehicleType: vehicleType.toLowerCase(),
        carPlate,
        password: hashed,
        fullCapacity: vehicleConfig.fuelCapacity,
        isApproved: false,
        documentPath: req.file.path,
        region: admin.region,
      },
    });

    res.status(201).json({
      msg: "Vehicle registered. Awaiting admin approval.",
      vehicleId: vehicle.id,
      generatedPassword: defaultPassword,
      fuelCapacity: vehicleConfig.fuelCapacity
    });

  } catch (err) {
    console.error("Vehicle Registration Error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
}

// Attendant registration has been moved to station owners only
// Register admins no longer register attendants directly

export async function registerFarmer(req, res) {
  try {
    const { fullName, kebele, woreda, phoneNumber } = req.body;

    if (!fullName || !kebele || !woreda || !phoneNumber) {
      return res.status(400).json({ msg: "All fields are required." });
    }

    if (!req.file) {
      return res.status(400).json({ msg: "Document is required." });
    }

    const existingFarmer = await prisma.farmer.findUnique({
      where: { phoneNumber },
    });
    if (existingFarmer) {
      return res.status(400).json({ msg: "Phone number already registered." });
    }

    const admin = await prisma.admin.findUnique({ where: { id: req.user.id } });
    const landSize = parseFloat(req.body.landSize) || 0;

    const newFarmer = await prisma.farmer.create({
      data: {
        fullName,
        kebele,
        woreda,
        phoneNumber,
        landSize,
        documentPath: req.file.path,
        region: admin.region,
        isApproved: false,
      },
    });

    res.status(201).json({ msg: "Farmer registered. Awaiting approval.", farmerId: newFarmer.id });
  } catch (err) {
    console.error("Farmer Registration Error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
}

export const registerOtherUser = async (req, res) => {
  try {
    const { fullName, phoneNumber, fuelType, maxUses, password } = req.body;

    if (!fullName || !phoneNumber || !fuelType) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const documentPath = req.file ? req.file.path : null;

    const admin = await prisma.admin.findUnique({ where: { id: req.user.id } });
    const totalAllowedLiters = parseFloat(req.body.totalAllowedLiters) || 0;
    
    // Hash passcode if provided
    const hashedPassword = password ? await hash(password, 10) : "";

    const newOtherUser = await prisma.otherUser.create({
      data: {
        fullName,
        phoneNumber,
        password: hashedPassword,
        fuelType: fuelType.toLowerCase(),
        totalAllowedLiters,
        documentPath,
        region: admin.region,
        maxUses: parseInt(maxUses) || -1,
      },
    });

    res.status(201).json({
      msg: "Other user registered successfully",
      othersId: newOtherUser.id,
    });
  } catch (err) {
    console.error("Register Other User Error:", err.message);
    res.status(500).json({ msg: "Server error while registering other user" });
  }
};

export async function registerMillHouseOwner(req, res) {
  try {
    const { fullName, kebele, woreda, phoneNumber, fuelType, dailyLimit } = req.body;

    if (!fullName || !kebele || !woreda || !phoneNumber) {
      return res.status(400).json({ msg: "All fields are required." });
    }

    if (!req.file) {
      return res.status(400).json({ msg: "Document is required." });
    }

    const existing = await prisma.millHouseOwner.findUnique({
      where: { phoneNumber },
    });
    if (existing) {
      return res.status(400).json({ msg: "Mill House Owner with this phone number already exists." });
    }

    const admin = await prisma.admin.findUnique({ where: { id: req.user.id } });
    const numberOfMills = parseInt(req.body.numberOfMills) || 1;

    const newOwner = await prisma.millHouseOwner.create({
      data: {
        fullName,
        kebele,
        woreda,
        phoneNumber,
        numberOfMills,
        fuelType: fuelType || "diesel",
        dailyLimit: numberOfMills * 300, // Pre-calculate or use for display
        documentPath: req.file.path,
        region: admin.region,
        isApproved: false,
      },
    });

    res.status(201).json({ msg: "Mill House Owner registered. Awaiting approval.", ownerId: newOwner.id });
  } catch (err) {
    console.error("Mill House Owner Registration Error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
}


export async function getRegisterDashboardStats(req, res) {
  try {
    const adminId = req.user.id;
    const admin = await prisma.admin.findUnique({ where: { id: adminId } });

    if (!admin) {
      return res.status(404).json({ msg: "Admin not found" });
    }

    const region = admin.region;
    const where = region ? { region } : {};

    const [vehicles, farmers, millHouseOwners, others, attendants] = await Promise.all([
      prisma.vehicle.count({ where }),
      prisma.farmer.count({ where }),
      prisma.millHouseOwner.count({ where }),
      prisma.otherUser.count({ where }),
      prisma.fuelAttendant.count({ where }),
    ]);

    res.status(200).json({
      vehicles,
      farmers,
      millHouseOwners,
      others,
      attendants,
    });
  } catch (err) {
    console.error("Dashboard Stats Error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
}
