import kbModel from "../models/kbModel.js";

const requiredFields = ["id", "codigo", "titulo", "estado", "version", "fecha", "calificacion", "vistas", "tickets"];
const updateFields = requiredFields.slice(1);

const hasFields = (body, fields) =>
  body !== null &&
  typeof body === "object" &&
  !Array.isArray(body) &&
  fields.every((field) => Object.hasOwn(body, field) && body[field] !== undefined);

const isValidId = (id) => (typeof id === "string" ? id.trim() !== "" : Number.isInteger(id));
const isValidKBA = (body, fields) => {
  if (!hasFields(body, fields)) {
    return false;
  }

  return fields.every((field) => {
    const value = body[field];
    if (field === "id") {
      return isValidId(value);
    }
    if (["calificacion", "vistas", "tickets"].includes(field)) {
      return typeof value === "number" && Number.isFinite(value) && value >= 0;
    }
    return typeof value === "string" && value.trim() !== "";
  });
};

const conocimientoController = {
  getKBAS: async (req, res) => {
    try {
      const result = await kbModel.getKBS();
      return res.status(200).json({
        message: "Articulos de conocimiento consultados con exito",
        data: result,
      });
    } catch (error) {
      console.error("Error al consultar la base de conocimiento", error);
      return res.status(500).json({
        message: "Hubo un error al consultar la base de conocimiento",
      });
    }
  },

  getKBA: async (req, res) => {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ message: "El identificador no es valido" });
    }

    try {
      const result = await kbModel.getKB(id);
      if (!result) {
        return res.status(404).json({ message: "No se encontro el articulo de conocimiento" });
      }
      return res.status(200).json({
        message: "Articulo de conocimiento consultado con exito",
        data: result,
      });
    } catch (error) {
      console.error("Error al consultar el articulo de conocimiento", error);
      return res.status(500).json({
        message: "Hubo un error al consultar el articulo de conocimiento",
      });
    }
  },

  createNewKBA: async (req, res) => {
    if (!isValidKBA(req.body, requiredFields)) {
      return res.status(400).json({
        message: `Se requieren valores validos para estos campos: ${requiredFields.join(", ")}`,
      });
    }

    try {
      const { id, codigo, titulo, estado, version, fecha, calificacion, vistas, tickets } = req.body;
      const result = await kbModel.createKB(id, codigo, titulo, estado, version, fecha, calificacion, vistas, tickets);
      return res.status(201).json({
        message: "Articulo de conocimiento creado con exito",
        data: { id: result.insertId || id },
      });
    } catch (error) {
      console.error("Error al crear el articulo de conocimiento", error);
      return res.status(500).json({
        message: "Hubo un error al crear el articulo de conocimiento",
      });
    }
  },

  updateKBA: async (req, res) => {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ message: "El identificador no es valido" });
    }
    if (!isValidKBA(req.body, updateFields)) {
      return res.status(400).json({
        message: `Se requieren valores validos para estos campos: ${updateFields.join(", ")}`,
      });
    }

    try {
      const { codigo, titulo, estado, version, fecha, calificacion, vistas, tickets } = req.body;
      const result = await kbModel.updateKB(id, codigo, titulo, estado, version, fecha, calificacion, vistas, tickets);
      if (result.affectedRows === 0 && !(await kbModel.getKB(id))) {
        return res.status(404).json({ message: "No se encontro el articulo de conocimiento" });
      }
      return res.status(200).json({
        message: "Articulo de conocimiento actualizado con exito",
        data: result,
      });
    } catch (error) {
      console.error("Error al actualizar el articulo de conocimiento", error);
      return res.status(500).json({
        message: "Hubo un error al actualizar el articulo de conocimiento",
      });
    }
  },

  deleteKBA: async (req, res) => {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ message: "El identificador no es valido" });
    }

    try {
      const result = await kbModel.deleteKB(id);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "No se encontro el articulo de conocimiento" });
      }
      return res.status(200).json({
        message: "Articulo de conocimiento eliminado con exito",
        data: result,
      });
    } catch (error) {
      console.error("Error al eliminar el articulo de conocimiento", error);
      return res.status(500).json({
        message: "Hubo un error al eliminar el articulo de conocimiento",
      });
    }
  },
};

export default conocimientoController;