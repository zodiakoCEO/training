import pool from "../config/db.js";

const dbModel = {
  getUsers: async () => {
    const [rows] = await pool.query("SELECT id, name, gmail FROM usuarios");
    return rows;
  },
  getUser: async (id) => {
    const [rows] = await pool.query("SELECT id, name, gmail FROM usuarios WHERE id = ?", [id]);
    return rows[0];
  },
  getUserByGmail: async (gmail) => {
    const [rows] = await pool.query(
      "SELECT id, name, gmail, password FROM usuarios WHERE gmail = ?",
      [gmail],
    );
    return rows[0];
  },
  updateUser: async (id, name, gmail) => {
    let query;
    let values;
    if (name === undefined) {
      query = "UPDATE usuarios SET gmail = ? WHERE id = ?";
      values = [gmail, id];
    } else if (gmail === undefined) {
      query = "UPDATE usuarios SET name = ? WHERE id = ?";
      values = [name, id];
    } else {
      query = "UPDATE usuarios SET name = ?, gmail = ? WHERE id = ?";
      values = [name, gmail, id];
    }
    const [result] = await pool.query(query, values);
    return result;
  },
  createUser: async (name, gmail, passwordHash) => {
    const [result] = await pool.query(
      "INSERT INTO usuarios (name, gmail, password) VALUES (?, ?, ?)",
      [name, gmail, passwordHash],
    );
    return result;
  },
  deleteUser: async (id) => {
    const [result] = await pool.query("DELETE FROM usuarios WHERE id = ?", [id]);
    return result;
  },

};


export default dbModel;