import { Router } from "express";
const router = Router();
import { register, login, approveDriver } from "../controllers/authController.js";
import { upload } from '../middleWare/multerConfig.js';
router.post('/register', upload.single('document'), register);
router.post("/login", login);
router.put("/approve/:driverId", approveDriver);

export default router;
