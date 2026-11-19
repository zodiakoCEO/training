import express from "express";
import userController from "../controllers/userController.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";

const router = express.Router();
router.post("/login", userController.login);
router.use(authenticate, requireAdmin);
router.get("/", userController.getUsers);
router.get("/:id", userController.getUser);
router.post("/", userController.createNewUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

export default router;
