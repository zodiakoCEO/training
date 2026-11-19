import dbModel from "../models/dbModel.js";
import bcrypt from "bcrypt";
import {
  isObject,
  isValidGmail,
  isValidName,
  isValidPassword,
  normalizeGmail,
} from "../utils/validation.js";
import { createAccessToken } from "../middleware/auth.js";

const isValidId = (id) => typeof id === "string" && id.trim() !== "";

const userController = {
  getUsers: async (req, res) => {
    try {
      const result = await dbModel.getUsers();

      return res.status(200).json({
        message: "Usuarios consultados con exito...",
        data: result,
      });
    } catch (error) {
      console.error("Error al consultar los usuarios...", error);
      return res.status(500).json({
        message: "Hubo un error por parte del servidor...",
      });
    }
  },

  getUser: async (req, res) => {
    try {
      const { id } = req.params;
      if (!isValidId(id)) {
        return res.status(400).json({
          message: "El campo es erroneo o esta vacio....",
        });
      }

      const result = await dbModel.getUser(id);
      if (!result) {
        return res.status(404).json({ message: "No se encontro el usuario" });
      }

      return res.status(200).json({
        message: "Usuario consultado con exito",
        data: result,
      });
    } catch (error) {
      console.error("Error al consultar el usuario", error);
      return res.status(500).json({
        message: "Hubo un error por parte del servidor...",
      });
    }
  },

  createNewUser: async (req, res) => {
    try {
      if (!isObject(req.body)) {
        return res.status(400).json({
          message: "Se requieren un nombre, un correo y una contrasena validos",
        });
      }

      const { name, gmail, password } = req.body;
      if (!isValidName(name) || !isValidGmail(gmail) || !isValidPassword(password)) {
        return res.status(400).json({
          message: "Se requieren un nombre, un correo y una contrasena validos",
        });
      }

      const normalizedGmail = normalizeGmail(gmail);
      const existingUser = await dbModel.getUserByGmail(normalizedGmail);
      if (existingUser) {
        return res.status(409).json({ message: "Ya existe una cuenta con ese correo" });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const result = await dbModel.createUser(name.trim(), normalizedGmail, passwordHash);

      return res.status(201).json({
        message: "Usuario creado con exito...",
        data: {
          id: result.insertId,
          name: name.trim(),
          gmail: normalizedGmail,
        },
      });
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ message: "Ya existe una cuenta con ese correo" });
      }
      console.error("Error al crear el usuario...", error);
      return res.status(500).json({
        message: "Hubo un error por parte del servidor...",
      });
    }
  },

  login: async (req, res) => {
    try {
      if (!isObject(req.body)) {
        return res.status(400).json({ message: "Correo y contrasena son obligatorios" });
      }

      const { gmail, password } = req.body;
      if (!isValidGmail(gmail) || !isValidPassword(password)) {
        return res.status(400).json({ message: "Correo y contrasena son obligatorios" });
      }

      const user = await dbModel.getUserByGmail(normalizeGmail(gmail));
      const passwordMatches = !!user && typeof user.password === "string" && await bcrypt.compare(password, user.password);
      if (!passwordMatches) {
        return res.status(401).json({ message: "Correo o contrasena incorrectos" });
      }

      return res.status(200).json({
        message: "Inicio de sesion exitoso",
        data: {
          id: user.id,
          name: user.name,
          gmail: user.gmail,
          token: createAccessToken(user),
        },
      });
    } catch (error) {
      console.error("Error al iniciar sesion...", error);
      return res.status(500).json({
        message: "Hubo un error por parte del servidor...",
      });
    }
  },

  updateUser: async (req, res) => {
    try {
      const { id } = req.params;
      if (!isObject(req.body)) {
        return res.status(400).json({ message: "Se requiere al menos un campo valido para actualizar" });
      }
      const { name, gmail } = req.body;
      const hasName = Object.hasOwn(req.body, "name");
      const hasGmail = Object.hasOwn(req.body, "gmail");

      if (!isValidId(id) || (!hasName && !hasGmail) ||
          (hasName && !isValidName(name)) || (hasGmail && !isValidGmail(gmail))) {
        return res.status(400).json({
          message: "El nombre o el correo son invalidos",
        });
      }

      const result = await dbModel.updateUser(
        id,
        name?.trim(),
        gmail === undefined ? undefined : normalizeGmail(gmail),
      );
      if (result.affectedRows === 0 && !(await dbModel.getUser(id))) {
        return res.status(404).json({ message: "No se encontro el usuario" });
      }

      return res.status(200).json({
        message: "El usuario ha sido actualizado con exito...",
        data: result,
      });
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ message: "Ya existe una cuenta con ese correo" });
      }
      console.error("Error al actualizar el usuario...", error);
      return res.status(500).json({
        message: "Hubo un error por parte del servidor...",
      });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;
      if (!isValidId(id)) {
        return res.status(400).json({
          message: "El usuario no existe o error en los campos...",
        });
      }

      const result = await dbModel.deleteUser(id);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "No se encontro el usuario" });
      }

      return res.status(200).json({
        message: "Usuario eliminado con exito",
        data: result,
      });
    } catch (error) {
      console.error("Error al eliminar al usuario...", error);
      return res.status(500).json({
        message: "Hubo un error por parte del servidor...",
      });
    }
  },
};

export default userController;