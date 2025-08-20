import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import FuelAttendant from "../models/FuelAttendant.js";
import Driver from "../models/Driver.js";
import FuelTransaction from "../models/FuelTransaction.js";
import FuelStock from "../models/FuelStock.js";
import Farmer from "../models/Farmer.js";

export async function registerAttendant(req, res) {
  try {
    const { name, phone, password, stationName,city } = req.body;

    if (!name || !phone || !password || !stationName|| !city) {
      return res.status(400).json({ msg: "All fields are required." });
    }

    if (!req.file) {
      return res.status(400).json({ msg: "Document is required." });
    }

    const existing = await FuelAttendant.findOne({ phone });
    if (existing) {
      return res.status(400).json({ msg: "Phone already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAttendant = new FuelAttendant({
      name,
      phone,
      password: hashedPassword,
      stationName,
      city,
      documentPath: req.file.path,
    });

    await newAttendant.save();
    res
      .status(201)
      .json({ msg: "Registered successfully. Await admin approval." });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
}

export async function loginAttendant(req, res) {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ msg: "Phone and password are required." });
    }

    const attendant = await FuelAttendant.findOne({ phone });
    if (!attendant) {
      return res.status(404).json({ msg: "Attendant not found." });
    }

    const isMatch = await bcrypt.compare(password, attendant.password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid credentials." });
    }

    if (!attendant.isApproved) {
      return res.status(403).json({ msg: "Wait for admin approval." });
    }

    const token = jwt.sign(
      { id: attendant._id, role: "attendant" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      token,
      attendant: {
        id: attendant._id,
        name: attendant.name,
        phone: attendant.phone,
        stationName: attendant.stationName,
        city: attendant.city,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
}

export async function getAttendantProfile(req, res) {
  try {
    const attendant = await FuelAttendant.findById(req.user.id).select(
      "-password"
    );
    if (!attendant) {
      return res.status(404).json({ msg: "Attendant not found." });
    }
    res.status(200).json(attendant);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
}

function getLimit(carType) {
  if (carType === "bajaj") return 10;
  if (carType === "taxi") return 40;
  if (carType === "heavy") return 100;
  return 0;
}
function getGasType(carType) {
  switch (carType) {
    case "bajaj":
      return "benzene";
    case "taxi":
    case "heavy":
      return "Diesel";
    default:
      return null;
  }
}

export async function getDriverByQR(req, res) {
  try {
    const { id } = req.params;
    const driver = await Driver.findById(id);
    if (!driver || !driver.isApproved) {
      return res.status(404).json({ msg: "Driver not found or not approved." });
    }

    const fuelLimit = getLimit(driver.carType);

    const today = new Date().toDateString();
    const lastFuelDate = driver.lastFuelDate
      ? new Date(driver.lastFuelDate).toDateString()
      : null;

    if (lastFuelDate !== today) {
      driver.dailyLimitUsed = 0;
      driver.lastFuelDate = new Date();
      await driver.save();
    }

    const fuelLeft = Math.max(fuelLimit - (driver.dailyLimitUsed || 0), 0);

    res.status(200).json({
      id: driver._id,
      name: driver.name,
      carType: driver.carType,
      fuelLeft,
      gasType: getGasType(driver.carType),
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
}

export const dispenseFuel = async (req, res) => {
  try {
    const { userId, userType, liters, gasType, fuelAttendantId } = req.body;

    if (!userId || !userType || !liters || !gasType || !fuelAttendantId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Fetch and validate fuel attendant
    const fuelAttendant = await FuelAttendant.findById(fuelAttendantId);
    if (!fuelAttendant || !fuelAttendant.isApproved) {
      return res
        .status(404)
        .json({ message: "Fuel attendant not found or not approved" });
    }

    const today = new Date().toDateString();

    // Handle DRIVER
    if (userType === "driver") {
      const driver = await Driver.findById(userId);
      if (!driver || !driver.isApproved) {
        return res
          .status(404)
          .json({ message: "Driver not found or not approved" });
      }

      const lastFuelDate = driver.lastFuelDate
        ? new Date(driver.lastFuelDate).toDateString()
        : null;
      if (lastFuelDate !== today) {
        driver.dailyLimitUsed = 0;
        driver.lastFuelDate = new Date();
      }

      const carLimits = {
        bajaj: 10,
        taxi: 40,
        heavy: 100,
      };

      const limit = carLimits[driver.carType];
      if (!limit) {
        return res.status(400).json({ message: "Invalid car type" });
      }

      if (driver.dailyLimitUsed + liters > limit) {
        return res.status(400).json({ message: "Daily limit exceeded" });
      }

      // Check stock
      const stock = await FuelStock.findOne({
        stationName: fuelAttendant.stationName,
        city: fuelAttendant.city,
        gasType,
      }).sort({ createdAt: -1 });

      if (!stock || stock.litersReceived - stock.litersDispensed < liters) {
        return res.status(400).json({ message: "Not enough fuel in stock" });
      }

      // Update driver and stock
      driver.dailyLimitUsed += liters;
      driver.lastFuelDate = new Date();
      await driver.save();

      stock.litersDispensed += liters;
      await stock.save();

      
      await FuelTransaction.create({
        driver: driver._id,
        gasType,
        liters,
        stationName: fuelAttendant.stationName,
        attendantName: fuelAttendant.name ,
      });

      return res
        .status(200)
        .json({ message: "Fuel dispensed successfully to driver" });
    }

    // Handle FARMER
    else if (userType === "farmer") {
      const farmer = await Farmer.findById(userId);
      if (!farmer) {
        return res
          .status(404)
          .json({ message: "Farmer not found or not approved" });
      }

      // Check stock
      const stock = await FuelStock.findOne({
        stationName: fuelAttendant.stationName,
        city: fuelAttendant.city,
        gasType,
      }).sort({ createdAt: -1 });

      if (!stock || stock.litersReceived - stock.litersDispensed < liters) {
        return res.status(400).json({ message: "Not enough fuel in stock" });
      }

      // No daily limit logic for farmer here (add if needed)

      stock.litersDispensed += liters;
      await stock.save();
    

      await FuelTransaction.create({
        farmer: farmer._id,
        gasType,
        liters,
        stationName: fuelAttendant.stationName,
        attendantName: fuelAttendant.name,
      });

      return res
        .status(200)
        .json({ message: "Fuel dispensed successfully to farmer" });
    }

    // Invalid user type
    else {
      return res.status(400).json({ message: "Invalid user type" });
    }
  } catch (error) {
    console.error("Error in dispenseFuel:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export async function getAttendantTransactions(req, res) {
  try {
    const { stationName } = req.params;

    const transactions = await FuelTransaction.find({ stationName })
      .sort({ date: -1 })
      .limit(50)
      .populate("driver", "name carType") // populate driver info if exists
      .populate("farmer", "fullName landSize"); // populate farmer info if exists

    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
}
