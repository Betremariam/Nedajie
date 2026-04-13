import { Router } from "express";
import { registerAttendant, loginAttendant, getDriverByQR, dispenseFuel, getAttendantTransactions } from "../controllers/admins/attendantController.js";
import { upload } from '../middleWare/multerConfig.js';

const router = Router();

router.post("/register", upload.single("document"), registerAttendant);
router.post("/login", loginAttendant);
router.get('/driver/:id', getDriverByQR);
router.post('/dispense', dispenseFuel);
router.get('/transactions/:stationName', getAttendantTransactions);
export default router;
