import { Router } from "express";
import { loginAttendant, getVehicleByQR, dispenseFuel, getAttendantTransactions, changePassword } from "../controllers/admins/attendantController.js";
import authMiddleware from "../middleWare/authMiddleware.js";

const router = Router();

// Attendants are registered by station owners only - no public registration endpoint
router.post("/login", loginAttendant);
router.post("/change-password", authMiddleware, changePassword);
router.get('/vehicle/:id', getVehicleByQR);
router.post('/dispense', dispenseFuel);
router.get('/transactions/:stationName', getAttendantTransactions);
export default router;
