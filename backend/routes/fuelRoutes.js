import { Router } from "express";
const router = Router();
import prisma from "../lib/prisma.js";
import { getAttendantTransactions } from '../controllers/attendantController.js';
import { addFuelStock, getFuelStocks, getFuelLeftForDriver } from '../controllers/fuelController.js';

router.post("/add", addFuelStock);
router.get("/", getFuelStocks);
router.get('/fuel-left/:driverId', getFuelLeftForDriver);
router.get('/transactions/:stationName', getAttendantTransactions);
router.get("/fuel-left/:userType/:userId", async (req, res) => {
  try {
    const { userType, userId } = req.params;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const where = {
      createdAt: {
        gte: today,
        lt: tomorrow,
      },
    };

    if (userType === "driver") {
      where.driverId = userId;
    } else if (userType === "farmer") {
      where.farmerId = userId;
    } else {
      return res.status(400).json({ msg: "Invalid user type" });
    }

    const result = await prisma.fuelTransaction.aggregate({
      where,
      _sum: {
        liters: true,
      },
    });

    const fuelUsedToday = result._sum.liters || 0;
    res.status(200).json({ fuelLeft: fuelUsedToday }); // Note: Keeping key as 'fuelLeft' to match original API response, though value is 'fuelUsedToday' based on logic
  } catch (err) {
    res.status(500).json({ msg: "Error fetching fuel left", error: err.message });
  }
});


export default router;
