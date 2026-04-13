import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../../lib/prisma.js";

export async function registerAttendant(req, res) {
  try {
    const { name, phone, password, stationName, city, region } = req.body;

    if (!name || !phone || !password || !stationName || !city || !region) {
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
        region,
        documentPath: req.file.path,
      },
    });

    res.status(201).json({ msg: "Registered successfully. Await admin approval." });
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

    const attendant = await prisma.fuelAttendant.findUnique({
      where: { phone },
    });
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

    if (!attendant.isEnabled) {
      return res.status(403).json({ msg: "Your account has been disabled by the station owner." });
    }

    const token = jwt.sign(
      { id: attendant.id, role: "attendant" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      token,
      attendant: {
        id: attendant.id,
        name: attendant.name,
        phone: attendant.phone,
        stationName: attendant.stationName,
        city: attendant.city,
        region: attendant.region,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
}

export async function getAttendantProfile(req, res) {
  try {
    const attendant = await prisma.fuelAttendant.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        phone: true,
        stationName: true,
        city: true,
        region: true,
        isApproved: true,
        documentPath: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!attendant) {
      return res.status(404).json({ msg: "Attendant not found." });
    }
    res.status(200).json(attendant);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
}

function getLimit(carType) {
  const type = carType.toLowerCase();
  if (type === "bajaj") return 10;
  if (type === "taxi") return 40;
  if (type === "heavy") return 100;
  return 0;
}

function getGasType(vehicleType) {
  const type = vehicleType.toLowerCase();
  switch (type) {
    case "bajaj":
    case "motorcycle":
    case "car":
      return "benzene";
    case "taxi":
    case "heavy":
    case "truck":
    case "bus":
      return "Diesel";
    default:
      return "benzene"; // Fallback
  }
}

export async function getVehicleByQR(req, res) {
  try {
    const { id } = req.params;
    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
    });
    if (!vehicle || !vehicle.isApproved) {
      return res.status(404).json({ msg: "Vehicle not found or not approved." });
    }

    const fuelLimit = vehicle.fullCapacity;

    const today = new Date().toDateString();
    const lastFuelDate = vehicle.lastFuelDate
      ? new Date(vehicle.lastFuelDate).toDateString()
      : null;

    let updatedLimitUsed = vehicle.dailyLimitUsed || 0;
    if (lastFuelDate !== today) {
      updatedLimitUsed = 0;
      await prisma.vehicle.update({
        where: { id },
        data: {
          dailyLimitUsed: 0,
          lastFuelDate: new Date(),
        },
      });
    }

    const fuelLeft = Math.max(fuelLimit - updatedLimitUsed, 0);

    res.status(200).json({
      id: vehicle.id,
      name: vehicle.ownerName,
      vehicleType: vehicle.vehicleType,
      fuelLeft,
      gasType: getGasType(vehicle.vehicleType),
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
    const fuelAttendant = await prisma.fuelAttendant.findUnique({
      where: { id: fuelAttendantId },
    });
    if (!fuelAttendant || !fuelAttendant.isApproved) {
      return res.status(404).json({ message: "Fuel attendant not found or not approved" });
    }

    const today = new Date().toDateString();

    // -----------------------------------
    // VEHICLE LOGIC
    // -----------------------------------
    if (userType === "vehicle" || userType === "driver") {
      const vehicle = await prisma.vehicle.findUnique({
        where: { id: userId },
      });
      if (!vehicle || !vehicle.isApproved) {
        return res.status(404).json({ message: "Vehicle not found or not approved" });
      }

      const lastFuelDate = vehicle.lastFuelDate
        ? new Date(vehicle.lastFuelDate).toDateString()
        : null;

      let currentDailyLimitUsed = vehicle.dailyLimitUsed || 0;
      if (lastFuelDate !== today) {
        currentDailyLimitUsed = 0;
      }

      const limit = vehicle.fullCapacity;
      if (limit <= 0) {
        return res.status(400).json({ message: "Vehicle has no fuel capacity limit defined" });
      }

      if (currentDailyLimitUsed + liters > limit) {
        return res.status(400).json({ message: `Daily capacity limit exceeded. Allowed left: ${limit - currentDailyLimitUsed}L` });
      }

      // Check stock
      const stock = await prisma.fuelStock.findFirst({
        where: {
          stationName: fuelAttendant.stationName,
          city: fuelAttendant.city,
          gasType,
        },
        orderBy: { createdAt: 'desc' },
      });

      if (!stock || stock.litersReceived - stock.litersDispensed < liters) {
        return res.status(400).json({ message: "Not enough fuel in stock" });
      }

      // Atomic update using transaction
      await prisma.$transaction([
        prisma.vehicle.update({
          where: { id: userId },
          data: {
            dailyLimitUsed: currentDailyLimitUsed + liters,
            lastFuelDate: new Date(),
          },
        }),
        prisma.fuelStock.update({
          where: { id: stock.id },
          data: {
            litersDispensed: { increment: liters },
          },
        }),
        prisma.fuelTransaction.create({
          data: {
            vehicleId: vehicle.id,
            gasType,
            liters,
            stationName: fuelAttendant.stationName,
            attendantName: fuelAttendant.name,
            city: fuelAttendant.city,
            region: fuelAttendant.region,
          },
        }),
      ]);

      return res.status(200).json({ message: "Fuel dispensed successfully to vehicle" });
    }

    // -----------------------------------
    // FARMER LOGIC
    // -----------------------------------
    else if (userType === "farmer") {
      const farmer = await prisma.farmer.findUnique({
        where: { id: userId },
      });
      if (!farmer || !farmer.isApproved) {
        return res.status(404).json({ message: "Farmer not found or not approved" });
      }

      const now = new Date();
      const limitStartDate = farmer.limitStartDate ? new Date(farmer.limitStartDate) : null;

      let currentLitersUsed15Days = farmer.litersUsed15Days || 0;
      let updatedLimitStartDate = limitStartDate;

      if (!limitStartDate || (now.getTime() - limitStartDate.getTime()) / (1000 * 60 * 60 * 24) > 15) {
        currentLitersUsed15Days = 0;
        updatedLimitStartDate = now;
      }

      if (currentLitersUsed15Days + liters > 50) {
        const daysLeft = 15 - Math.floor((now.getTime() - updatedLimitStartDate.getTime()) / (1000 * 60 * 60 * 24));
        return res.status(400).json({
          message: `You have reached your 50-liter limit. Please wait ${daysLeft > 0 ? daysLeft : 0} day(s) for the next 15-day period.`,
        });
      }

      const stock = await prisma.fuelStock.findFirst({
        where: {
          stationName: fuelAttendant.stationName,
          city: fuelAttendant.city,
          gasType,
        },
        orderBy: { createdAt: 'desc' },
      });

      if (!stock || stock.litersReceived - stock.litersDispensed < liters) {
        return res.status(400).json({ message: "Not enough fuel in stock" });
      }

      await prisma.$transaction([
        prisma.farmer.update({
          where: { id: userId },
          data: {
            litersUsed15Days: currentLitersUsed15Days + liters,
            limitStartDate: updatedLimitStartDate,
          },
        }),
        prisma.fuelStock.update({
          where: { id: stock.id },
          data: {
            litersDispensed: { increment: liters },
          },
        }),
        prisma.fuelTransaction.create({
          data: {
            farmerId: farmer.id,
            gasType,
            liters,
            stationName: fuelAttendant.stationName,
            attendantName: fuelAttendant.name,
            city: fuelAttendant.city,
            region: fuelAttendant.region,
          },
        }),
      ]);

      return res.status(200).json({ message: "Fuel dispensed successfully to farmer" });
    } else {
      return res.status(400).json({ message: "Invalid user type" });
    }
  } catch (error) {
    console.error("Error in dispenseFuel:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export async function getAttendantTransactions(req, res) {
  try {
    const { stationName } = req.params;

    const transactions = await prisma.fuelTransaction.findMany({
      where: { stationName },
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        vehicle: {
          select: {
            ownerName: true,
            vehicleType: true,
          },
        },
        farmer: {
          select: {
            fullName: true,
            Kebele: true, // Assuming Kebele instead of landSize as per schema
          },
        },
      },
    });

    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
}
