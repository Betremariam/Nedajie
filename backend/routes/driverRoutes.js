import express from "express";
import {
  requestFuel,
  getDriverTransactions,
  getDriverDetails,
} from "../controllers/driverController.js";
import prisma from "../lib/prisma.js";

const router = express.Router();
router.post("/request-fuel", requestFuel);
router.get("/transactions", getDriverTransactions);
router.get("/:id/details", getDriverDetails);
router.get("/:id", async (req, res) => {
  try {
    const driver = await prisma.driver.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        name: true,
        phone: true,
        carType: true,
        carPlate: true,
        isApproved: true,
        createdAt: true,
      },
    });
    if (!driver) {
      return res.status(404).json({ msg: "Driver not found" });
    }
    res.status(200).json(driver);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
