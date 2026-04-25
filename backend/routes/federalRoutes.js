import express from "express";
import { 
  createRegionalSuperAdmin, 
  createOwner, 
  addFuelDelivery, 
  getAllFuelDeliveries,
  getFederalAdmins,
  getFederalDashboardStats
} from "../controllers/admins/federalController.js";
import verifyToken from "../middleWare/verifyToken.js";
import { upload } from '../middleWare/multerConfig.js';

const router = express.Router();

// Middleware to ensure the user is 'federal'
const isFederal = (req, res, next) => {
  if (req.user.role !== "federal") {
    return res.status(403).json({ msg: "Access denied. Federal role required." });
  }
  next();
};

router.use(verifyToken, isFederal);

router.post("/create-super-admin", upload.single("document"), createRegionalSuperAdmin);
router.post("/create-owner", upload.fields([
  { name: 'legalDoc', maxCount: 1 },
  { name: 'fuelLicense', maxCount: 1 },
  { name: 'constructionDoc', maxCount: 1 },
  { name: 'safetyCert', maxCount: 1 },
  { name: 'envClearance', maxCount: 1 },
  { name: 'pumpCalibration', maxCount: 1 }
]), createOwner);

router.post("/add-fuel", upload.single("letter"), addFuelDelivery);
router.get("/fuel-deliveries", getAllFuelDeliveries);
router.get("/admins", getFederalAdmins);
router.get("/dashboard-stats", getFederalDashboardStats);

export default router;
