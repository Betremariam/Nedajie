import prisma from "../../lib/prisma.js";
import bcrypt from "bcryptjs";
import { hash } from "bcryptjs";

export async function registerVehicle(req, res) {
  try {
    const { ownerName, phone, vehicleType, carPlate, password, fullCapacity } = req.body;

    if (!req.file) {
      return res.status(400).json({ msg: "Document is required" });
    }

    const existing = await prisma.vehicle.findUnique({
      where: { phone },
    });
    if (existing) return res.status(400).json({ msg: "Vehicle phone already registered" });

    const hashed = await hash(password, 10);
    const admin = await prisma.admin.findUnique({ where: { id: req.user.id } });

    const vehicle = await prisma.vehicle.create({
      data: {
        ownerName,
        phone,
        vehicleType: vehicleType.toLowerCase(),
        carPlate,
        password: hashed,
        fullCapacity: parseFloat(fullCapacity) || 0,
        isApproved: false,
        documentPath: req.file.path,
        region: admin.region,
      },
    });

    res.status(201).json({
      msg: "Vehicle registered. Awaiting admin approval.",
      vehicleId: vehicle.id,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function registerAttendant(req, res) {
  try {
    const { name, phone, password, stationName, city } = req.body;

    if (!name || !phone || !password || !stationName || !city) {
      return res.status(400).json({ msg: "All fields are required." });
    }

    if (!req.file) {
      return res.status(400).json({ msg: "Document is required." });
    }

    const existing = await prisma.fuelAttendant.findUnique({
      where: { phone },
    });
    if (existing) {
      return res.status(400).json({ msg: "Phone already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await prisma.admin.findUnique({ where: { id: req.user.id } });

    const newAttendant = await prisma.fuelAttendant.create({
      data: {
        name,
        phone,
        password: hashedPassword,
        stationName,
        city,
        region: admin.region,
        documentPath: req.file.path,
      },
    });

    res.status(201).json({ msg: "Registered successfully. Await admin approval." });

  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
}

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

    const newFarmer = await prisma.farmer.create({
      data: {
        fullName,
        kebele,
        woreda,
        phoneNumber,
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
    const { fullName, phoneNumber, fuelType } = req.body;

    if (!fullName || !phoneNumber || !fuelType) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const documentPath = req.file ? req.file.path : null;

    const admin = await prisma.admin.findUnique({ where: { id: req.user.id } });

    const newOtherUser = await prisma.otherUser.create({
      data: {
        fullName,
        phoneNumber,
        fuelType: fuelType.toLowerCase(),
        documentPath,
        region: admin.region,
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

