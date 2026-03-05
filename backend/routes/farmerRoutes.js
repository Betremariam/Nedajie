import express from "express";
import {
  registerFarmer,
  getAllFarmers,
  requestFarmerFuel,
  getFarmerTransactions,
  getFarmerDetails
} from "../controllers/farmerController.js";

const router = express.Router();

router.post("/register", registerFarmer);
router.get("/", getAllFarmers);
router.post("/request-fuel", requestFarmerFuel);
router.get("/transactions", getFarmerTransactions);
router.get("/:id", getFarmerDetails);

export default router;
