import express from "express";
import { 
  getPendingDeliveriesForSuperAdmin, 
  confirmDeliveryBySuperAdmin, 
  getDeliveriesForOwner, 
  acceptDeliveryByOwner 
} from "../controllers/admins/fuelWorkflowController.js";
import verifyToken from "../middleWare/verifyToken.js";
import authMiddleware from "../middleWare/authMiddleware.js";
import attachAdmin from "../middleWare/attachAdmin.js";
import authorizeRoles from "../middleWare/authorizeRoles.js";

const router = express.Router();

router.use(verifyToken);

// Super Admin endpoints
router.get("/super/pending", getPendingDeliveriesForSuperAdmin);
router.put("/super/confirm/:deliveryId", confirmDeliveryBySuperAdmin);

// Owner endpoints
router.get("/owner/pending", authMiddleware, attachAdmin, authorizeRoles("stationOwner"), getDeliveriesForOwner);
router.put("/owner/accept/:deliveryId", authMiddleware, attachAdmin, authorizeRoles("stationOwner"), acceptDeliveryByOwner);

export default router;
