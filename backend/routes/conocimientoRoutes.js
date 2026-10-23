import express from "express";
import conocimientoController from "../controllers/conocimientoController.js";

const router = express.Router();

router.get("/", conocimientoController.getKBAS);
router.get("/:id", conocimientoController.getKBA);
router.post("/", conocimientoController.createNewKBA);
router.put("/:id", conocimientoController.updateKBA);
router.delete("/:id", conocimientoController.deleteKBA);

export default router;
