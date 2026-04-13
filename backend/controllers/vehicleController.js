import prisma from "../lib/prisma.js";
import moment from "moment";

export async function requestFuel(req, res) {
  try {
    const { vehicleId, liters, gasType } = req.body;

    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
    });
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

    const maxLimit = vehicle.fullCapacity;
    if (maxLimit <= 0) return res.status(400).json({ message: "Vehicle capacity not defined" });

    const today = moment().startOf("day").toDate();

    const existing = await prisma.fuelTransaction.findFirst({
      where: {
        vehicleId: vehicleId,
        createdAt: { gte: today },
      },
    });

    if (existing) {
      return res.status(403).json({ message: "This vehicle already received fuel today" });
    }

    if (liters > maxLimit) {
      return res.status(400).json({ message: `Limit exceeded: Max ${maxLimit}L allowed based on capacity` });
    }

    const newTransaction = await prisma.fuelTransaction.create({
      data: {
        vehicleId: vehicleId,
        liters,
        gasType,
      },
    });

    res.status(201).json({ message: "Fuel request accepted", data: newTransaction });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

export async function getVehicleTransactions(req, res) {
  try {
    const transactions = await prisma.fuelTransaction.findMany({
      include: {
        vehicle: {
          select: {
            ownerName: true,
            phone: true,
            vehicleType: true,
            carPlate: true
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ message: "Error fetching transactions", error: err.message });
  }
}

export async function getVehicleDetails(req, res) {
  const { id } = req.params;

  try {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
    });
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    const today = moment().startOf("day").toDate();
    const transaction = await prisma.fuelTransaction.findFirst({
      where: {
        vehicleId: id,
        createdAt: { gte: today },
      },
    });

    const alreadyReceivedFuelToday = !!transaction;

    res.status(200).json({
      vehicle: {
        id: vehicle.id,
        ownerName: vehicle.ownerName,
        vehicleType: vehicle.vehicleType,
        carPlate: vehicle.carPlate,
        fullCapacity: vehicle.fullCapacity
      },
      alreadyReceivedFuelToday,
    });
  } catch (error) {
    console.error("Error getting vehicle details:", error);
    res.status(500).json({ message: "Server error" });
  }
}
