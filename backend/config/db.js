import mysql from "mysql2/promise";
import "dotenv/config";

const isProduction = process.env.NODE_ENV === "production";
const requiredVariables = ["HOST_DB", "NAME_DB"];
if (isProduction) {
  requiredVariables.push("USER_DB", "PASSWORD_DB");
}

const missingVariables = requiredVariables.filter((name) => !process.env[name]?.trim());
if (missingVariables.length > 0) {
  throw new Error(`Missing required database configuration: ${missingVariables.join(", ")}`);
}

const port = Number(process.env.PORT_DB || 3306);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT_DB must be an integer between 1 and 65535");
}

const pool = mysql.createPool({
  host: process.env.HOST_DB,
  database: process.env.NAME_DB,
  port,
  user: process.env.USER_DB || "root",
  password: process.env.PASSWORD_DB || "",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;