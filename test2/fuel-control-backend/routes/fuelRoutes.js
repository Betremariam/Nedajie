import { Router } from "express";
const router = Router();
import { addFuelStock, getFuelStocks,getFuelLeftForDriver } from "../controllers/fuelController.js";
import Transaction from "../models/FuelTransaction.js";
import { getAttendantTransactions } from '../controllers/attendantController.js';

router.post("/add", addFuelStock);
router.get("/", getFuelStocks);
router.get('/fuel-left/:driverId', getFuelLeftForDriver);
router.get('/transactions/:stationName', getAttendantTransactions);
router.get("/fuel-left/:userType/:userId", async (req, res) => {
  try {
    const { userType, userId } = req.params;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const filter = {
      createdAt: { $gte: today },
    };

    // Decide which field to filter by
    if (userType === "driver") {
      filter.driver = userId;
    } else if (userType === "farmer") {
      filter.farmer = userId;
    } else {
      return res.status(400).json({ msg: "Invalid user type" });
    }

    const transactions = await Transaction.find(filter);

    const fuelLeft = transactions.reduce((acc, t) => acc + t.amount, 0);
    res.status(200).json({ fuelLeft });
  } catch (err) {
    res.status(500).json({ msg: "Error fetching fuel left", error: err.message });
  }
});


export default router;
