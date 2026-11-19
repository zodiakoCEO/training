import express from "express";
import conocimientoController from "../controllers/conocimientoController.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticate);
router.get("/", conocimientoController.getKBAS);
router.get("/:id", conocimientoController.getKBA);
router.use(requireAdmin);
router.post("/", conocimientoController.createNewKBA);
router.put("/:id", conocimientoController.updateKBA);
router.delete("/:id", conocimientoController.deleteKBA);

export default router;
