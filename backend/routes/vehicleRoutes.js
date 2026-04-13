import express from "express";
import {
  requestFuel,
  getVehicleTransactions,
  getVehicleDetails,
} from "../controllers/vehicleController.js";
import prisma from "../lib/prisma.js";

const router = express.Router();
router.post("/request-fuel", requestFuel);
router.get("/transactions", getVehicleTransactions);
router.get("/:id/details", getVehicleDetails);
router.get("/:id", async (req, res) => {
  try {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        ownerName: true,
        phone: true,
        vehicleType: true,
        carPlate: true,
        fullCapacity: true,
        isApproved: true,
        createdAt: true,
      },
    });
    if (!vehicle) {
      return res.status(404).json({ msg: "Vehicle not found" });
    }
    res.status(200).json(vehicle);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
