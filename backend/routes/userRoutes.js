import express from "express";
import userController from "../controllers/userController.js";

const router = express.Router();
//Rutas usuarios
router.post("/login", userController.login);
router.get("/", userController.getUsers);
router.get("/:id", userController.getUser);
router.post("/", userController.createNewUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

export default router;
