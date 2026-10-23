import express from "express";
import userRoutes from "./routes/userRoutes.js";
import conocimientoRoutes from "./routes/conocimientoRoutes.js";
import cors from "cors";

const app = express();
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/kbas", conocimientoRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API funcionando" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
