import express from "express";
import multer from "multer";
import verifyToken from "../middleware/verifyToken.js";
import authorizeRoles from "../middleware/authorizeRoles.js";
import attachAdmin from "../middleware/attachAdmin.js"; 

import {
  createAdmin,
  getAllAdmins,
  deleteAdmin,
  getAllFuelTransactions,
  getAllFuelStocks,
  addFuelStock,
  updateFuelDispensed,
  refillFuelStock,
  getFarmerDetails,
  getDriverDetails,
  createStationOwner,
  getAllOthers,
  getAllDrivers,
  getAllFarmers,
  getFuelDeliveries,
  uploadFuelDeliveries,
  approveFuelDelivery
} from "../controllers/admins/superAdminController.js";

import {
  approveDriver,
  getUnapprovedDrivers,
  rejectDriver,
  approveAttendant,
  getUnapprovedAttendants,
  rejectAttendant,
  approveFarmer,
  getUnapprovedFarmers,
  rejectFarmer,
  approveOthers,
  getUnapprovedOthers,
  rejectOther,
} from "../controllers/admins/approverAdminController.js"; // 🔄 Make sure this is approverController now

import { registerDriver, registerAttendant, registerFarmer,registerOtherUser } from "../controllers/admins/registerAdminController.js";


const router = express.Router();

// All routes below are for super admin only
const protectSuper = [verifyToken, authorizeRoles("super")];
const approverOnly = [verifyToken, authorizeRoles("approver"),attachAdmin];
const registerAdmin = [verifyToken, authorizeRoles("register")];


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/documents/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  }
});

const upload = multer({ storage });

// Admin management
router.post("/admins", protectSuper, createAdmin);             // Create registerer/approver admin
router.get("/admins", protectSuper, getAllAdmins);             // Get all admins
router.delete("/admins/:adminId", protectSuper, deleteAdmin);  // Delete admin

// Fuel management
router.get("/transactions", protectSuper, getAllFuelTransactions);  // All transactions
router.get("/fuel-stocks", protectSuper, getAllFuelStocks);         // View all fuel stocks
router.post("/fuel-stocks", protectSuper, addFuelStock);            // Add fuel stock
router.put("/fuel-stocks/:stockId/dispensed", protectSuper, updateFuelDispensed);  // Update dispensed
router.put("/fuel-stocks/:stockId/refill", protectSuper, refillFuelStock); 
router.get("/drivers",protectSuper, getAllDrivers);  
router.get("/farmers",protectSuper,getAllFarmers);
// User details
router.get("/farmer/:id", protectSuper, getFarmerDetails);    // Farmer eligibility & details
router.get("/driver/:id", protectSuper, getDriverDetails); 
router.post("/owners", protectSuper, createStationOwner);
router.get("/others", protectSuper, getAllOthers);
router.post('/upload-deliveries', upload.single('xlsx'),protectSuper, uploadFuelDeliveries);
router.get('/deliveries',protectSuper, getFuelDeliveries);
router.patch('/approve/:id',protectSuper, approveFuelDelivery);


router.get("/unapproved-drivers", approverOnly, getUnapprovedDrivers);
router.put("/approve-driver/:driverId", approverOnly, approveDriver);
router.delete('/reject-driver/:driverId',approverOnly, rejectDriver); 

// 🧑‍🔧 Attendant approval
router.get("/unapproved-attendants", approverOnly, getUnapprovedAttendants);
router.put("/approve-attendant/:attendantId", approverOnly, approveAttendant);
router.delete('/reject-attendant/:attendantId',approverOnly, rejectAttendant);

// 🌾 Farmer approval
router.get("/unapproved-farmers", approverOnly, getUnapprovedFarmers);
router.put("/approve-farmer/:farmerId", approverOnly, approveFarmer);
router.delete('/reject-farmer/:farmerId', approverOnly, rejectFarmer);


router.put("/approve-other-user/:otherId", approverOnly, approveOthers);
router.get("/unapproved-other-user", approverOnly, getUnapprovedOthers);
router.delete('/reject-other-user/:otherId', approverOnly, rejectOther);

// Register a new driver
router.post(
  "/register-driver",
  registerAdmin,
  upload.single("document"),
  registerDriver
);

// Register a new fuel attendant
router.post(
  "/register-attendant",
  registerAdmin,
  upload.single("document"),
  registerAttendant
);

// Register a new farmer
router.post(
  "/register-farmer",
  registerAdmin,
  upload.single("document"),
  registerFarmer
);

router.post(
  "/register-other-user",
  registerAdmin,
  upload.single("document"),
  registerOtherUser
);



export default router;





















