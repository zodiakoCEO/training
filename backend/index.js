import express from "express";
import "dotenv/config";
import userRoutes from "./routes/userRoutes.js";
import conocimientoRoutes from "./routes/conocimientoRoutes.js";
import cors from "cors";
import { validateAuthConfig } from "./middleware/auth.js";

validateAuthConfig();
const app = express();
const isProduction = process.env.NODE_ENV === "production";
const configuredOrigins = process.env.FRONTEND_ORIGIN
  ? process.env.FRONTEND_ORIGIN.split(",").map((origin) => origin.trim()).filter(Boolean)
  : isProduction
    ? []
    : ["http://localhost:5173"];

if (configuredOrigins.length === 0) {
  throw new Error("FRONTEND_ORIGIN must include at least one allowed origin");
}

const allowedOrigins = configuredOrigins
  .map((origin) => {
    let parsedOrigin;
    try {
      parsedOrigin = new URL(origin);
    } catch {
      throw new Error("FRONTEND_ORIGIN must contain valid origin URLs");
    }

    if (
      parsedOrigin.origin === "null" ||
      parsedOrigin.pathname !== "/" ||
      parsedOrigin.search ||
      parsedOrigin.hash ||
      parsedOrigin.username ||
      parsedOrigin.password ||
      (isProduction && parsedOrigin.protocol !== "https:")
    ) {
      throw new Error("FRONTEND_ORIGIN must contain HTTPS origins without paths in production");
    }

    return parsedOrigin.origin;
  })

app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: "1mb" }));
app.use("/api/users", userRoutes);
app.use("/api/kbas", conocimientoRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API funcionando" });
});

app.use((req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

app.use((error, req, res, next) => {
  if (error.type === "entity.parse.failed") {
    return res.status(400).json({ message: "El cuerpo de la solicitud debe ser JSON valido" });
  }
  if (error.type === "entity.too.large") {
    return res.status(413).json({ message: "El cuerpo de la solicitud excede el limite permitido" });
  }

  console.error("Error no controlado en la solicitud", error);
  return res.status(500).json({ message: "Hubo un error por parte del servidor" });
});

const PORT = Number(process.env.PORT || 3001);
if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) {
  throw new Error("PORT must be an integer between 1 and 65535");
}

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
