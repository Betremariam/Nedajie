import FuelTransaction from "../models/FuelTransaction.js";
import Driver from "../models/Driver.js";
import moment from "moment";


export async function requestFuel(req, res) {
  try {
    const { driverId, liters, gasType } = req.body;

    const driver = await Driver.findById(driverId);
    if (!driver) return res.status(404).json({ message: "Driver not found" });

    const limits = {
      bajaj: 10,
      taxi: 40,
      heavy: 100,
    };

    const maxLimit = limits[driver.carType];
    if (!maxLimit) return res.status(400).json({ message: "Unknown car type" });

    const today = moment().startOf("day").toDate();

    const existing = await FuelTransaction.findOne({
      driver: driverId, 
      date: { $gte: today },
    });

    if (existing) {
      return res.status(403).json({ message: "You already received fuel today" });
    }

    if (liters > maxLimit) {
      return res.status(400).json({ message: `Limit exceeded: Max ${maxLimit}L allowed` });
    }

    const newTransaction = new FuelTransaction({
      driver: driverId, 
      liters,
      gasType,
    });

    await newTransaction.save();

    res.status(201).json({ message: "Fuel request accepted", data: newTransaction });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}


export async function getDriverTransactions(req, res) {
  try {
    const transactions = await FuelTransaction.find()
      .populate("driver", "name phoneNumber carType") 
      .sort({ date: -1 });

    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ message: "Error fetching transactions", error: err.message });
  }
}


export async function getDriverDetails(req, res) {
  const { id } = req.params;

  try {
    const driver = await Driver.findById(id);
    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    const today = moment().startOf("day").toDate();
    const transaction = await FuelTransaction.findOne({
      driver: id, 
      date: { $gte: today },
    });

    const alreadyReceivedFuelToday = !!transaction;

    res.status(200).json({
      driver: {
        id: driver._id,
        name: driver.name,
        vehicleType: driver.carType,
        fuelLimit: driver.fuelLimit,
      },
      alreadyReceivedFuelToday,
    });
  } catch (error) {
    console.error("Error getting driver details:", error);
    res.status(500).json({ message: "Server error" });
  }
}
