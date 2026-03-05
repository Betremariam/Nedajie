import prisma from "../lib/prisma.js";
import bcrypt from "bcryptjs";

export const getOwnerFuelStock = async (req, res) => {
  try {
    let { stationIds } = req.query;

    if (!stationIds) {
      return res.status(400).json({ msg: "No station IDs provided" });
    }

    if (!Array.isArray(stationIds)) {
      stationIds = [stationIds];
    }

    const stocks = await prisma.fuelStock.findMany({
      where: {
        id: { in: stationIds },
      },
    });

    if (!stocks || stocks.length === 0) {
      return res.status(404).json({ msg: "No fuel stock found for these stations" });
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
    let { stationIds } = req.query;

    if (!stationIds) {
      return res.status(400).json({ msg: "No station IDs provided" });
    }

    if (!Array.isArray(stationIds)) {
      stationIds = [stationIds];
    }

    const records = await prisma.fuelReceived.findMany({
      where: {
        fuelStockId: { in: stationIds },
      },
      orderBy: { createdAt: 'desc' },
      include: {
        fuelStock: {
          select: {
            stationName: true,
            city: true,
            gasType: true,
          },
        },
      },
    });

    if (!records || records.length === 0) {
      return res.status(404).json({ msg: "No fuel received records found for these stations" });
    }

    const formatted = records.map((r) => ({
      id: r.id,
      stationName: r.fuelStock?.stationName || "",
      city: r.fuelStock?.city || "",
      gasType: r.gasType,
      liters: r.liters,
      date: r.date,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("ownerFuelReceived error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

export const ownerStations = async (req, res) => {
  try {
    let stationIds = req.admin.stationIds; // array of strings (Ids)
    if (!stationIds || stationIds.length === 0) {
      return res.status(400).json({ msg: "⚠️ No stations assigned to this owner" });
    }

    const stations = await prisma.fuelStock.findMany({
      where: {
        id: { in: stationIds },
      },
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
    let { stationIds } = req.query;
    if (!stationIds) {
      return res.status(400).json({ msg: "No station IDs provided" });
    }
    if (!Array.isArray(stationIds)) {
      stationIds = [stationIds];
    }

    const stocks = await prisma.fuelStock.findMany({
      where: { id: { in: stationIds } },
    });

    if (stocks.length === 0) {
      return res.status(404).json({ msg: "No stations found" });
    }

    const orConditions = stocks.map(stock => ({
      stationName: stock.stationName,
      city: stock.city,
    }));

    const transactions = await prisma.fuelTransaction.findMany({
      where: {
        OR: orConditions,
      },
      orderBy: { createdAt: 'desc' },
      include: {
        driver: { select: { name: true } },
        farmer: { select: { fullName: true } },
      },
    });

    if (!transactions || transactions.length === 0) {
      return res.status(404).json({ msg: "No transactions for these stations" });
    }

    res.json(transactions);
  } catch (err) {
    console.error("ownerTransactions error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

export const ownerReports = async (req, res) => {
  try {
    let { stationIds, type } = req.query;
    if (!stationIds) {
      return res.status(400).json({ msg: "No station IDs provided" });
    }
    if (!Array.isArray(stationIds)) {
      stationIds = [stationIds];
    }

    const stocks = await prisma.fuelStock.findMany({
      where: { id: { in: stationIds } },
    });

    if (stocks.length === 0) {
      return res.status(404).json({ msg: "No stations found" });
    }

    const orConditions = stocks.map(stock => ({
      stationName: stock.stationName,
      city: stock.city,
    }));

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

    const transactions = await prisma.fuelTransaction.findMany({
      where: {
        OR: orConditions,
        createdAt: { gte: startDate }, // Using createdAt consistently
      },
      orderBy: { createdAt: 'desc' },
      include: {
        driver: { select: { name: true } },
        farmer: { select: { fullName: true } },
      },
    });

    const totalLiters = transactions.reduce((sum, t) => sum + (t.liters || 0), 0);

    res.json({ transactions, totalLiters });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

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

    await prisma.fuelAttendant.create({
      data: {
        name,
        phone,
        password: hashedPassword,
        stationName,
        city,
        documentPath: req.file.path,
      },
    });

    res.status(201).json({ msg: "Registered successfully. Await admin approval." });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
}
