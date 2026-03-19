import express from "express";
import { 
  createRegionalSuperAdmin, 
  createOwner, 
  addFuelDelivery, 
  getAllFuelDeliveries 
} from "../controllers/admins/federalController.js";
import verifyToken from "../middleWare/verifyToken.js";

const router = express.Router();

// Middleware to ensure the user is 'federal'
const isFederal = (req, res, next) => {
  if (req.user.role !== "federal") {
    return res.status(403).json({ msg: "Access denied. Federal role required." });
  }
  next();
};

router.use(verifyToken, isFederal);

router.post("/create-super-admin", createRegionalSuperAdmin);
router.post("/create-owner", createOwner);
router.post("/add-fuel", addFuelDelivery);
router.get("/fuel-deliveries", getAllFuelDeliveries);

export default router;
