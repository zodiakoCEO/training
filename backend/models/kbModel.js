import pool from "../config/db.js";

const kbModel = {
  getKBS: async () => {
    const [rows] = await pool.query("SELECT * FROM kbas");
    return rows;
  },

  getKB: async (id) => {
    const [rows] = await pool.query("SELECT * FROM kbas WHERE id = ?", [id]);
    return rows[0];
  },

  updateKB: async (id, codigo, titulo, estado, version, fecha, calificacion, vistas, tickets) => {
    const [result] = await pool.query(
      "UPDATE kbas SET codigo = ?, titulo = ?, estado = ?, version = ?, fecha = ?, calificacion = ?, vistas = ?, tickets = ? WHERE id = ?",
      [codigo, titulo, estado, version, fecha, calificacion, vistas, tickets, id],
    );
    return result;
  },

  createKB: async (id, codigo, titulo, estado, version, fecha, calificacion, vistas, tickets) => {
    const [result] = await pool.query(
      "INSERT INTO kbas (id, codigo, titulo, estado, version, fecha, calificacion, vistas, tickets) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [id, codigo, titulo, estado, version, fecha, calificacion, vistas, tickets],
    );
    return result;
  },

  deleteKB: async (id) => {
    const [result] = await pool.query("DELETE FROM kbas WHERE id = ?", [id]);
    return result;
  },
};

export default kbModel;