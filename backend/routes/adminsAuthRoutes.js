import express from "express";
import { loginAdmin, changePassword } from "../controllers/admins/adminAuthController.js";
import verifyToken from "../middleWare/verifyToken.js";

const router = express.Router();

router.post("/login", loginAdmin);
router.post("/change-password", verifyToken, changePassword); // Force change on first login

export default router;