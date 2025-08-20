import express from "express";
import { loginAdmin } from "../controllers/admins/adminAuthController.js";

const router = express.Router();

router.post("/login", loginAdmin); // <== keep it clean like this

export default router;