import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import usuariosRoutes from "./routes/usuarios.js";
import juegosRoutes from "./routes/juegos.js";
import resenasRoutes from "./routes/resenas.js";
import estadisticasRoutes from "./routes/estadisticas.js";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/usuarios", usuariosRoutes);   // 👈 AQUÍ ES DONDE ESTÁ /me
app.use("/api/juegos", juegosRoutes);
app.use("/api/resenas", resenasRoutes);
app.use("/api/estadisticas", estadisticasRoutes);

// Conexión a MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB conectado"))
  .catch((err) => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
