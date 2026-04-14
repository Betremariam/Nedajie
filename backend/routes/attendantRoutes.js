import { Router } from "express";
import { registerAttendant, loginAttendant, getVehicleByQR, dispenseFuel, getAttendantTransactions } from "../controllers/admins/attendantController.js";
import { upload } from '../middleWare/multerConfig.js';

const router = Router();

// Removed public registration - only station owners can register attendants
// router.post("/register", upload.single("document"), registerAttendant);
router.post("/login", loginAttendant);
router.get('/vehicle/:id', getVehicleByQR);
router.post('/dispense', dispenseFuel);
router.get('/transactions/:stationName', getAttendantTransactions);
export default router;
