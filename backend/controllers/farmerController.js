import prisma from '../lib/prisma.js';
import moment from 'moment';

// @desc    Register a new farmer
// @route   POST /api/farmers/register
export async function registerFarmer(req, res) {
  const { fullName, kebele, woreda, phoneNumber } = req.body;

  if (!fullName || !kebele || !woreda || !phoneNumber) {
    return res.status(400).json({ message: 'Please fill in all fields.' });
  }

  try {
    const existing = await prisma.farmer.findUnique({
      where: { phoneNumber },
    });
    if (existing) {
      return res.status(400).json({ message: 'Farmer with this phone number already exists.' });
    }

    const farmer = await prisma.farmer.create({
      data: {
        fullName,
        kebele,
        woreda,
        phoneNumber,
      },
    });

    res.status(201).json(farmer);
  } catch (error) {
    console.error('Farmer registration failed:', error.message);
    res.status(500).json({ message: 'Server error while registering farmer.' });
  }
}

// @desc    Get all farmers
// @route   GET /api/farmers
export async function getAllFarmers(req, res) {
  try {
    const farmers = await prisma.farmer.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json(farmers);
  } catch (err) {
    console.error('Failed to fetch farmers:', err.message);
    res.status(500).json({ message: 'Failed to fetch farmers' });
  }
}

// @desc    Farmer fuel request (50L benzene every 15 days)
// @route   POST /api/farmers/request-fuel
export async function requestFarmerFuel(req, res) {
  try {
    const { farmerId } = req.body;
    const FIXED_LITERS = 50;
    const GAS_TYPE = "benzene";

    const farmer = await prisma.farmer.findUnique({
      where: { id: farmerId },
    });
    if (!farmer) return res.status(404).json({ message: "Farmer not found" });

    const last15Days = moment().subtract(15, 'days').startOf('day').toDate();

    const recentTx = await prisma.fuelTransaction.findFirst({
      where: {
        farmerId: farmerId,
        createdAt: { gte: last15Days },
      },
    });

    if (recentTx) {
      return res.status(403).json({ message: "Fuel already received in last 15 days" });
    }

    const tx = await prisma.fuelTransaction.create({
      data: {
        farmerId: farmerId,
        liters: FIXED_LITERS,
        gasType: GAS_TYPE,
      },
    });

    res.status(201).json({ message: "Fuel granted", data: tx });
  } catch (err) {
    console.error("Farmer fuel request error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

// @desc    Get farmer's fuel transactions
// @route   GET /api/farmers/transactions
export async function getFarmerTransactions(req, res) {
  try {
    const transactions = await prisma.fuelTransaction.findMany({
      where: {
        farmerId: { not: null },
      },
      include: {
        farmer: {
          select: {
            fullName: true,
            phoneNumber: true,
            kebele: true,
            woreda: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json(transactions);
  } catch (err) {
    console.error("Error fetching farmer transactions:", err.message);
    res.status(500).json({ message: "Error fetching transactions" });
  }
}

// @desc    Get farmer details + if eligible for fuel
// @route   GET /api/farmers/:id
export async function getFarmerDetails(req, res) {
  const { id } = req.params;

  try {
    const farmer = await prisma.farmer.findUnique({
      where: { id },
    });
    if (!farmer) {
      return res.status(404).json({ message: "Farmer not found" });
    }

    const last15Days = moment().subtract(15, 'days').startOf('day').toDate();

    const recentTx = await prisma.fuelTransaction.findFirst({
      where: {
        farmerId: id,
        createdAt: { gte: last15Days },
      },
    });

    const isEligible = !recentTx;

    res.status(200).json({
      farmer: {
        id: farmer.id,
        name: farmer.fullName,
        phoneNumber: farmer.phoneNumber,
        kebele: farmer.kebele,
        woreda: farmer.woreda,
      },
      isEligible,
    });
  } catch (error) {
    console.error("Error getting farmer details:", error);
    res.status(500).json({ message: "Server error" });
  }
}
