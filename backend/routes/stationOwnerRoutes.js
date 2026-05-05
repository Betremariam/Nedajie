import express from "express";
import authMiddleware from "../middleWare/authMiddleware.js";
import attachAdmin from "../middleWare/attachAdmin.js";
import authorizeRoles from "../middleWare/authorizeRoles.js";
import multer from "multer";
import {
  getOwnerFuelStock,
  ownerFuelReceived,
  ownerTransactions,
  ownerReports,
  ownerStations,
  registerAttendant,
  getMyAttendants,
  toggleAttendantStatus,
  generateAttendantPassword,
} from "../controllers/stationOwnerController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/documents/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage });
// 🔹 Fuel Received
router.get(
  "/stock",
  authMiddleware,
  attachAdmin,
  authorizeRoles("stationOwner"),
  getOwnerFuelStock
);
router.get(
  "/fuel-received",
  authMiddleware,
  attachAdmin,
  authorizeRoles("stationOwner"),
  ownerFuelReceived
);
router.get(
  "/stations",
  authMiddleware,
  attachAdmin,
  authorizeRoles("stationOwner"),
  ownerStations
);

// 🔹 Transactions
router.get(
  "/transactions",
  authMiddleware,
  attachAdmin,
  authorizeRoles("stationOwner"),
  ownerTransactions
);

// 🔹 Reports
router.get(
  "/reports",
  authMiddleware,
  attachAdmin,
  authorizeRoles("stationOwner"),
  ownerReports
);
router.post(
  "/attendant",
  authMiddleware,
  attachAdmin,
  authorizeRoles("stationOwner"),
  upload.single("document"),
  registerAttendant
);

router.get(
  "/my-attendants",
  authMiddleware,
  attachAdmin,
  authorizeRoles("stationOwner"),
  getMyAttendants
);

router.patch(
  "/attendant/:id/toggle",
  authMiddleware,
  attachAdmin,
  authorizeRoles("stationOwner"),
  toggleAttendantStatus
);

router.post(
  "/attendant/:id/generate-password",
  authMiddleware,
  attachAdmin,
  authorizeRoles("stationOwner"),
  generateAttendantPassword
);

export default router;
