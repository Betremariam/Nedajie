import express from "express";
import { 
  getPendingDeliveriesForSuperAdmin, 
  confirmDeliveryBySuperAdmin, 
  getDeliveriesForOwner, 
  acceptDeliveryByOwner 
} from "../controllers/admins/fuelWorkflowController.js";
import verifyToken from "../middleWare/verifyToken.js";

const router = express.Router();

router.use(verifyToken);

// Super Admin endpoints
router.get("/super/pending", getPendingDeliveriesForSuperAdmin);
router.put("/super/confirm/:deliveryId", confirmDeliveryBySuperAdmin);

// Owner endpoints
router.get("/owner/pending", getDeliveriesForOwner);
router.put("/owner/accept/:deliveryId", acceptDeliveryByOwner);

export default router;
