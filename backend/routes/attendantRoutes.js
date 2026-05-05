import { Router } from "express";
import { loginAttendant, getVehicleByQR, dispenseFuel, getAttendantTransactions } from "../controllers/admins/attendantController.js";

const router = Router();

// Attendants are registered by station owners only - no public registration endpoint
router.post("/login", loginAttendant);
router.get('/vehicle/:id', getVehicleByQR);
router.post('/dispense', dispenseFuel);
router.get('/transactions/:stationName', getAttendantTransactions);
export default router;
