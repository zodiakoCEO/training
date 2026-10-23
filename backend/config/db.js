import mysql from "mysql2/promise";
import "dotenv/config";

const pool = mysql.createPool({
  host: process.env.HOST_DB,
  database: process.env.NAME_DB,
  port: Number(process.env.PORT_DB) || 3306,
  user: process.env.USER_DB || "root",
  password: process.env.PASSWORD_DB || "",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;