import prisma from "../lib/prisma.js";
import bcrypt from "bcryptjs";

export const getOwnerFuelStock = async (req, res) => {
  try {
    const { stationName } = req.admin;

    if (!stationName) {
      return res.status(400).json({ msg: "No station name associated with this owner" });
    }

    const stocks = await prisma.fuelStock.findMany({
      where: { stationName },
    });

    if (!stocks || stocks.length === 0) {
      return res.json({ benzene: 0, diesel: 0, count: 0 });
    }

    let benzeneTotal = 0;
    let dieselTotal = 0;

    stocks.forEach((stock) => {
      const current = stock.litersReceived - (stock.litersDispensed || 0);
      if (stock.gasType?.toLowerCase() === "benzene") {
        benzeneTotal += current;
      } else if (stock.gasType?.toLowerCase() === "diesel") {
        dieselTotal += current;
      }
    });

    res.json({
      benzene: benzeneTotal,
      diesel: dieselTotal,
      count: stocks.length,
    });
  } catch (err) {
    console.error("getOwnerFuelStock error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};


export const ownerFuelReceived = async (req, res) => {
  try {
    const { stationName } = req.admin;

    if (!stationName) {
      return res.status(400).json({ msg: "No station associated" });
    }

    const records = await prisma.fuelReceived.findMany({
      where: {
        station: { stationName: stationName }
      },
      orderBy: { createdAt: 'desc' },
      include: {
        station: {
          select: {
            stationName: true,
            city: true,
            gasType: true,
          },
        },
      },
    });

    if (!records || records.length === 0) {
      return res.json([]);
    }

    const formatted = records.map((r) => ({
      id: r.id,
      stationName: r.station?.stationName || "",
      city: r.station?.city || "",
      gasType: r.gasType,
      liters: r.liters,
      date: r.date,
      documentPath: r.documentPath,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("ownerFuelReceived error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};


export const ownerStations = async (req, res) => {
  try {
    const { stationName } = req.admin;
    if (!stationName) {
      return res.status(400).json({ msg: "⚠️ No station assigned to this owner" });
    }

    const stations = await prisma.fuelStock.findMany({
      where: { stationName },
      select: {
        id: true,
        stationName: true,
        city: true,
      },
    });
    res.json(stations);
  } catch (err) {
    console.error("ownerStations error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};


export const ownerTransactions = async (req, res) => {
  try {
    const { stationName } = req.admin;
    if (!stationName) {
      return res.status(400).json({ msg: "No station associated" });
    }

    const transactionsRaw = await prisma.fuelTransaction.findMany({
      where: { stationName },
      orderBy: { createdAt: 'desc' },
      include: {
        vehicle: { select: { ownerName: true } },
        farmer: { select: { fullName: true } },
      },
    });

    if (!transactionsRaw || transactionsRaw.length === 0) {
      return res.json([]);
    }

    const transactions = transactionsRaw.map((tx) => ({
      ...tx,
      driver: tx.vehicle ? { name: tx.vehicle.ownerName } : undefined,
      vehicle: undefined,
    }));

    res.json(transactions);
  } catch (err) {
    console.error("ownerTransactions error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};


export const ownerReports = async (req, res) => {
  try {
    const { stationName } = req.admin;
    const { type } = req.query;
    if (!stationName) {
      return res.status(400).json({ msg: "No station associated" });
    }

    let startDate = new Date();
    switch (type) {
      case "daily":
        startDate.setHours(0, 0, 0, 0);
        break;
      case "weekly":
        startDate.setDate(startDate.getDate() - 7);
        break;
      case "monthly":
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case "yearly":
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate = new Date(0); // all time
    }

    const transactionsRaw = await prisma.fuelTransaction.findMany({
      where: {
        stationName,
        createdAt: { gte: startDate },
      },
      orderBy: { createdAt: 'desc' },
      include: {
        vehicle: { select: { ownerName: true } },
        farmer: { select: { fullName: true } },
      },
    });

    const transactions = transactionsRaw.map((tx) => ({
      ...tx,
      driver: tx.vehicle ? { name: tx.vehicle.ownerName } : undefined,
      vehicle: undefined,
    }));

    const totalLiters = transactions.reduce((sum, t) => sum + (t.liters || 0), 0);

    res.json({ transactions, totalLiters });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};


export async function registerAttendant(req, res) {
  try {
    const { name, phone } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ msg: "Name and phone are required." });
    }

    if (!req.file) {
      return res.status(400).json({ msg: "Employment proof document is required." });
    }

    const existing = await prisma.fuelAttendant.findUnique({
      where: { phone },
    });
    if (existing) {
      return res.status(400).json({ msg: "Phone already registered." });
    }

    // Get owner's station details
    const owner = await prisma.fuelStation.findUnique({
      where: { id: req.admin.id },
      select: { stationName: true, city: true, region: true }
    });

    if (!owner) {
      return res.status(400).json({ msg: "Station owner not found." });
    }

    // Create attendant without password - will be generated after approval
    await prisma.fuelAttendant.create({
      data: {
        name,
        phone,
        password: "", // Empty password - will be set when owner generates it
        stationName: owner.stationName,
        city: owner.city,
        region: owner.region,
        documentPath: req.file.path,
        ownerId: req.admin.id,
        isEnabled: false, // Disabled until approved and password is generated
      },
    });

    res.status(201).json({ 
      msg: "Attendant registered successfully. Awaiting approval." 
    });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
}

export async function getMyAttendants(req, res) {
  try {
    const attendants = await prisma.fuelAttendant.findMany({
      where: { ownerId: req.admin.id },
      orderBy: { createdAt: 'desc' }
    });
    res.json(attendants);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
}

export async function toggleAttendantStatus(req, res) {
  try {
    const { id } = req.params;
    const attendant = await prisma.fuelAttendant.findFirst({
      where: { id, ownerId: req.admin.id }
    });

    if (!attendant) {
      return res.status(404).json({ msg: "Attendant not found or not owned by you." });
    }

    const updated = await prisma.fuelAttendant.update({
      where: { id },
      data: { isEnabled: !attendant.isEnabled }
    });

    res.json({ msg: `Attendant ${updated.isEnabled ? "enabled" : "disabled"}`, isEnabled: updated.isEnabled });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
}

export async function generateAttendantPassword(req, res) {
  try {
    const { id } = req.params;
    
    const attendant = await prisma.fuelAttendant.findFirst({
      where: { id, ownerId: req.admin.id }
    });

    if (!attendant) {
      return res.status(404).json({ msg: "Attendant not found or not owned by you." });
    }

    if (!attendant.isApproved) {
      return res.status(400).json({ msg: "Attendant must be approved before generating password." });
    }

    // Generate a random password
    const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);

    await prisma.fuelAttendant.update({
      where: { id },
      data: { 
        password: hashedPassword,
        isEnabled: true // Enable when password is generated
      }
    });

    res.json({ 
      msg: "Password generated successfully", 
      generatedPassword 
    });
  } catch (err) {
    console.error("Generate Password Error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
}
